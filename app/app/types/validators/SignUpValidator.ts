import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

const signUpFormSchema = z.object({
  name: z
    .string()
    .min(1, "ユーザー名は必須入力です")
    .max(64, "ユーザー名は64文字以下で入力してください"),
  email: z
    .string()
    .email("メールアドレスを正しい形式で入力してください")
    .max(128, "メールアドレスは128文字以下で入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(128, "パスワードは128文字以下で入力してください")
    .refine(
      (password: string) => /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      "パスワードは半角英数字の両方を含めてください"
    ),
});

export const signUpValidator = withZod(signUpFormSchema);
