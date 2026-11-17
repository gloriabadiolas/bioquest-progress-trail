/** Students sign in with class code + username; behind the scenes each gets a private, never-mailed address. */

export const CLASS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CLASS_CODE_LENGTH = 6;
export const MIN_PASSWORD = 6;

export function normalizeUsername(raw: string) {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function normalizeClassCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidUsername(raw: string) {
  const u = normalizeUsername(raw);
  return u.length >= 3 && u.length <= 20;
}

export function studentEmail(classCode: string, username: string) {
  return `${normalizeUsername(username)}.${normalizeClassCode(classCode).toLowerCase()}@alumnos.repasobio.app`;
}

export function generateClassCode(rand: () => number = Math.random) {
  let code = "";
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) code += CLASS_CODE_ALPHABET[Math.floor(rand() * CLASS_CODE_ALPHABET.length)];
  return code;
}

export function authErrorMessage(message: string | undefined, kind: "student" | "teacher" = "student") {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials"))
    return kind === "student"
      ? "Código, usuario o contraseña incorrectos. Si no recuerdas la contraseña, pídesela a tu profesora."
      : "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return kind === "student" ? "Ese usuario ya existe en esta clase. Elige otro." : "Ya existe una cuenta con ese correo.";
  if (m.includes("database error")) return "El código de clase no es válido.";
  if (m.includes("weak") || m.includes("pwned") || m.includes("password"))
    return `La contraseña es demasiado fácil. Usa al menos ${MIN_PASSWORD} caracteres y mezcla letras y números.`;
  if (m.includes("rate limit")) return "Demasiados intentos seguidos. Espera un minuto y vuelve a probar.";
  return "No se ha podido completar. Inténtalo de nuevo.";
}
