import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.logout(request, {
    redirectTo: "/auth/login",
  });
};

const Index = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Hello {user.name}さん</h1>
      <Form method="post">
        <button type="submit" name="action" value="logout">
          Logout
        </button>
      </Form>
    </>
  );
};

export default Index;
