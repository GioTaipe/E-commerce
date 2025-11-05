import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const router = Router();
const controller = new CategoryController();

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/", controller.getAll);

export default router;
