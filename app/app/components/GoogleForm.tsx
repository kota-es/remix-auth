import { Form } from "@remix-run/react";
import { tv } from "tailwind-variants";
import { FaGoogle } from "react-icons/fa";

const googleFormStyles = tv({
  slots: {
    googleForm: "my-4",
    btn: "w-full rounded-xl bg-white px-3 py-2 text-white border border-gray-600 font-semibold transition duration-300 ease-in-out hover:bg-gray-200",
    icon: "mr-2",
    btnText: "",
  },
  compoundSlots: [
    { slots: ["googleForm", "btn"], class: "flex justify-center items-center" },
    { slots: ["icon", "btnText"], class: "text-gray-700" },
  ],
});

export const GoogleForm = () => {
  const { googleForm, btn, icon, btnText } = googleFormStyles();

  return (
    <Form method="post" className={googleForm()}>
      <button
        type="submit"
        name="_action"
        value="Sign In Google"
        className={btn()}
      >
        <FaGoogle size={22} className={icon()} />
        <span className={btnText()}>Sign In with Google</span>
      </button>
    </Form>
  );
};
