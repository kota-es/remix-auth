import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { tv } from "tailwind-variants";
import { authenticator } from "../services/auth.server";
import { createUser } from "../services/signup.server";
import { Link, useActionData } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { signUpValidator } from "../types/validators/SignUpValidator";
import { TextField } from "../components/TextField";
import { GoogleForm } from "../components/GoogleForm";

const signUpPageStyles = tv({
  slots: {
    base: "h-full justify-center items-center flex flex-col gap-y-5",
    form: "rounded-2xl bg-white p-6 w-[420px]",
    title: "text-3xl font-extrabold text-black-600 mb-5",
    btnWrapper: "text-center mt-5",
    btn: "rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600",
    text: "text-gray-600",
    link: "text-red-600 px-2 hover:underline",
  },
  compoundSlots: [{ slots: ["btnWrapper", "btn"], class: "w-full" }],
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const action = String(formData.get("_action"));

  switch (action) {
    case "Sign Up": {
      const name = String(formData.get("name"));
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const errors: { [key: string]: string } = {};

      if (
        typeof action !== "string" ||
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return json(
          { error: "Invalid form data", form: action },
          { status: 400 }
        );
      }

      const result = await createUser({ name, email, password });

      if (result.error) {
        errors.email = result.error.message;
      }

      if (Object.keys(errors).length > 0) {
        return json({ errors });
      }

      return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "/auth/signup",
        context: { formData },
      });
    }

    case "Sign In Google":
      return authenticator.authenticate("google", request);

    default:
      return null;
  }
};

const SignUpPage = () => {
  const { base, form, title, btnWrapper, btn, text, link } = signUpPageStyles();

  const actionData = useActionData<typeof action>();
  const errors = (actionData as { errors?: { [key: string]: string } })?.errors;

  return (
    <div className={base()}>
      <div className={form()}>
        <ValidatedForm validator={signUpValidator} method="POST">
          <h2 className={title()}>Create an account</h2>
          <TextField htmlFor="name" type="name" label="Name" />
          <TextField
            htmlFor="email"
            label="Email"
            errorMessage={errors?.email}
          />
          <TextField htmlFor="password" type="password" label="Password" />
          <div className={btnWrapper()}>
            <button
              type="submit"
              name="_action"
              value="Sign Up"
              className={btn()}
            >
              Create an account
            </button>
          </div>
        </ValidatedForm>
        <GoogleForm />
        <div>
          <p className={text()}>
            Already have an account?
            <Link to="/auth/login">
              <span className={link()}>Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
