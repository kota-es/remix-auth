import { ComponentProps, FC } from "react";
import { useField } from "remix-validated-form";
import { tv } from "tailwind-variants";

const textFieldStyles = tv({
  slots: {
    base: "flex flex-col w-full",
    labelSlot: "text-gray-600 font-semibold",
    textField: "w-full p-2 rounded-xl my-2 border border-gray-300 outline-none",
    errMsg: "text-red-500 mb-2",
  },
  variants: {
    hasError: {
      true: { textField: "border-red-500" },
    },
  },
});

type TextFielsProps = Readonly<{
  htmlFor: string;
  label: string;
  type?: ComponentProps<"input">["type"];
  errorMessage?: string;
}>;

export const TextField: FC<TextFielsProps> = ({
  htmlFor,
  label,
  type,
  errorMessage,
}) => {
  const { error } = useField(htmlFor);
  const { base, labelSlot, textField, errMsg } = textFieldStyles({
    hasError: !!error,
  });

  return (
    <div className={base()}>
      <label htmlFor={htmlFor} className={labelSlot()}>
        {label}
      </label>
      <input name={htmlFor} type={type} id={htmlFor} className={textField()} />
      {error && <span className={errMsg()}>{error}</span>}
      {errorMessage && <span className={errMsg()}>{errorMessage}</span>}
    </div>
  );
};
