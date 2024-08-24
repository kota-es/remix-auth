import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sessionStorage } from "../services/session.server";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GoogleStrategy } from "remix-auth-google";
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

if (
  !(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.CLIENT_URL
  )
) {
  throw new Error(
    "GOOGLE_CLIENT_ID、GOOGLE_CLIENT_SECRET、CLIENT_URLが設定されていません。"
  );
}

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.CLIENT_URL}/api/auth/google/callback`,
  },
  async ({ profile }) => {
    const user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (user) {
      return user;
    }

    const newUser = await prisma.user.create({
      data: {
        id: profile.id,
        email: profile.emails[0].value || "",
        password: "",
        name: profile.displayName || "",
        image: profile.photos[0].value || "",
        provider: "google",
        updatedAt: new Date(), // Add the updatedAt property
      },
    });

    return newUser;
  }
);

authenticator.use(googleStrategy);

export { authenticator };
