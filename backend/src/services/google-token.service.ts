import { UnauthorizedError } from "../utils/errors.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
}

export class GoogleTokenService {
  async verifyIdToken(idToken: string): Promise<GoogleTokenPayload> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!response.ok) {
      throw new UnauthorizedError("Token de Google inválido");
    }

    const payload = (await response.json()) as GoogleTokenPayload;

    // Validar issuer
    if (
      payload.iss !== "accounts.google.com" &&
      payload.iss !== "https://accounts.google.com"
    ) {
      throw new UnauthorizedError("Token de Google inválido: issuer incorrecto");
    }

    // Validar audience (debe coincidir con nuestro Client ID)
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      throw new UnauthorizedError("Token de Google inválido: audience incorrecto");
    }

    // Validar que el email esté verificado
    if (payload.email_verified !== "true") {
      throw new UnauthorizedError("El email de Google no está verificado");
    }

    // Validar expiración
    const exp = parseInt(payload.exp, 10);
    if (Date.now() >= exp * 1000) {
      throw new UnauthorizedError("Token de Google expirado");
    }

    return payload;
  }
}
