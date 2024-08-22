import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sessionStorage } from "../services/session.server";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "../libs/db";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined");
}

const authenticator = new Authenticator<Omit<User, "password">>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email");
  const password = form.get("password");

  if (!(email && password)) {
    throw new Error("Invalid Request");
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email) },
  });

  if (!user) {
    throw new AuthorizationError();
  }

  const passwordsMatch = await bcrypt.compare(String(password), user.password);

  if (!passwordsMatch) {
    throw new AuthorizationError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
});

authenticator.use(formStrategy, "user-pass");

export { authenticator };
