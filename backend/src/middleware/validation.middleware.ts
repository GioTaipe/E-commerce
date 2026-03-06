import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

// [FIX] Tipo genérico en vez de `any` para el constructor del DTO
type ClassConstructor<T> = new (...args: unknown[]) => T;

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body, { enableImplicitConversion: true });

    // [FIX] whitelist: true rechaza propiedades no declaradas en el DTO (previene mass assignment)
    // [FIX] forbidNonWhitelisted: true devuelve error si se envían campos extra
    const errors = await validate(dtoObject as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      return res.status(400).json({ errors: messages });
    }

    // [FIX] Asignar el objeto transformado a req.body para que @Type() surta efecto
    req.body = dtoObject;
    next();
  };
}
