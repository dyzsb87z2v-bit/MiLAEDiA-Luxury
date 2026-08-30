import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type Request } from "express";

const router: IRouter = Router();
const COOKIE_NAME = "milaedia_admin_session";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000;

type SessionPayload = {
  email: string;
  expiresAt: number;
};

function getSecret() {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required.");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function createSession(email: string) {
  const payload: SessionPayload = {
    email,
    expiresAt: Date.now() + SESSION_LIFETIME_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function readSession(req: Request): SessionPayload | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: SESSION_LIFETIME_MS,
    path: "/",
  };
}

router.get("/admin/session", (req, res) => {
  const session = readSession(req);
  if (!session) {
    res.json({ authenticated: false });
    return;
  }
  res.json({
    authenticated: true,
    user: { email: session.email, role: "gallery-admin" },
    mode: process.env["NODE_ENV"] === "production" ? "production" : "development",
  });
});

router.post("/admin/login", (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!validEmail || password.length < 8) {
    res.status(400).json({
      authenticated: false,
      message: "Enter a valid email and a password of at least 8 characters.",
    });
    return;
  }

  if (process.env["NODE_ENV"] === "production") {
    const adminEmail = process.env["ADMIN_EMAIL"];
    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminEmail || !adminPassword) {
      res.status(503).json({
        authenticated: false,
        message: "Production admin authentication is not configured.",
      });
      return;
    }
    if (email !== adminEmail || password !== adminPassword) {
      res.status(401).json({
        authenticated: false,
        message: "The email or password is incorrect.",
      });
      return;
    }
  }

  res.cookie(COOKIE_NAME, createSession(email), cookieOptions());
  res.json({
    authenticated: true,
    user: { email, role: "gallery-admin" },
    mode: process.env["NODE_ENV"] === "production" ? "production" : "development",
  });
});

router.post("/admin/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ authenticated: false });
});

export default router;