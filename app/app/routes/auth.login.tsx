import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { ValidatedForm } from "remix-validated-form";
import { tv } from "tailwind-variants";
import { TextField } from "../components/TextField";
import { authenticator } from "../services/auth.server";
import { loginValidator } from "../types/validators/LoginValidator";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App login" }];
};

const loginPageStyles = tv({
  slots: {
    base: "h-full justify-center items-center flex flex-col gap-y-5",
    form: "ronded-2xl bg-white p-6 w-[420px]",
    title: "text-3xl font-extrabold text-black-600 mb-5",
    btnWrapper: "text-center mt-5",
    btn: "rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold tranisition duration-300 hover:bg-red-600",
    text: "text-gray-600",
    link: "text-red-600 px-2 hover:underline",
  },
  compoundSlots: [{ slots: ["btnWrapper", "btn"], class: "w-full" }],
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return user;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  });
};

const LoginPage = () => {
  const { base, form, title, btnWrapper, btn, text, link } = loginPageStyles();

  return (
    <div className={base()}>
      <div className={form()}>
        <ValidatedForm validator={loginValidator} method="POST">
          <h2 className={title()}>Login</h2>
          <TextField htmlFor="email" label="email" />
          <TextField htmlFor="password" type="password" label="Password" />
          <div className={btnWrapper()}>
            <button
              type="submit"
              name="_action"
              value="Sign In"
              className={btn()}
            >
              Login
            </button>
          </div>
        </ValidatedForm>
      </div>
      <p className={text()}>
        Don&apos;t have an account?
        <Link to="/auth/signup">
          <span className={link()}>Sign Up</span>
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
