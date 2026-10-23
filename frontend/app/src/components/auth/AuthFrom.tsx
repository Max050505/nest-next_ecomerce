"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/ui/CustomInput";
import { useAuthStore } from "@/store/auth.store";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
  try {
    await login(data.email, data.password);

    reset();

    const userRole = useAuthStore.getState().user?.role;

    if (userRole === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/");
    }

    router.refresh();
  } catch (error) {
    console.error("Login error:", error);
  }
};
  return (
    <section className="flex h-screen w-screen items-center justify-center rounded-[2rem]">
      <div
        className="
          flex
          min-h-[600px]
          w-full
          max-w-[1000px]
          gap-8
          overflow-hidden

          max-md:flex-col
          max-md:items-center
        "
      >
        {/* FORM */}

        <div
          className="
            box-border
            flex
            h-full
            w-1/2
            flex-col
            justify-center
            gap-4
            rounded-[10%]
            bg-white/30
            p-4
            shadow-[2px_4px_10px_rgba(0,0,0,0.3)]
            mr-[10px]

            max-md:w-[60%]
            max-md:items-center
          "
        >
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <h2 className="text-[1.8rem] font-bold">Login</h2>

            {/* EMAIL */}

            <Controller
              control={control}
              name="email"
              rules={{
                required: "You must input email address",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Incorrect email",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <CustomInput
                    {...field}
                    type="email"
                    label="Email"
                    placeholder="Email"
                    autocomplete="email"
                    status={fieldState.invalid ? "error" : ""}
                    data-testid="email"
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* PASSWORD */}

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Input your password",
                minLength: {
                  value: 6,
                  message: "Password must be 6 or more symbols.",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <CustomInput
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="Password"
                    autocomplete="current-password"
                    status={fieldState.invalid ? "error" : ""}
                    data-testid="password"
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-4
                h-12
                w-full
                rounded-md
                bg-[#162d3a]
                text-white
                transition
                hover:bg-[#203f50]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>
          </motion.form>

          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              href="/auth?mode=register"
              className="font-medium text-[#162d3a] underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
