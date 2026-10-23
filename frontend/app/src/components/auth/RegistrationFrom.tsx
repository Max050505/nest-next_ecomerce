"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/ui/CustomInput";
import { useAuthStore } from "@/store/auth.store";

type RegistrationFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegistrationForm() {
  const router = useRouter();

  const register = useAuthStore((state) => state.register);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      reset();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <section
      className="
        flex
        h-screen
        w-screen
        flex-col
        items-center
        justify-center
        rounded-[2rem]
      "
    >
      <div
        className="
          flex
          min-h-[500px]
          w-full
          max-w-[1200px]
          items-center
          justify-center
          gap-8
          overflow-hidden
        "
      >
        <div
          className="
            flex
            items-center
            gap-8
            rounded-[10%]
            bg-white/30
            p-5
            shadow-[2px_4px_10px_rgba(0,0,0,0.3)]
          "
        >
          <motion.form
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            onSubmit={handleSubmit(onSubmit)}
            className="
              flex
              w-full
              flex-col
              gap-4
            "
          >
            <h2 className="text-[1.8rem] font-bold">
              Create your account here
            </h2>

            {/* FIRST NAME + LAST NAME */}

            <div className="flex gap-4 max-md:flex-col">
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: "It is required field",
                }}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <CustomInput
                      {...field}
                      type="text"
                      label="First name"
                      data-testid="first-name"
                      placeholder="Input your first name"
                      autocomplete="given-name"
                      status={fieldState.invalid ? "error" : ""}
                    />

                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: "Input your last name",
                }}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <CustomInput
                      {...field}
                      type="text"
                      label="Last name"
                      data-testid="last-name"
                      placeholder="Input your last name"
                      autocomplete="family-name"
                      status={fieldState.invalid ? "error" : ""}
                    />

                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* EMAIL */}

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Input this field with your email",
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
                    placeholder="Input your email"
                    data-testid="email"
                    autocomplete="email"
                    status={fieldState.invalid ? "error" : ""}
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
                required: "Input password",
                minLength: {
                  value: 6,
                  message: "Password must contain at least 6 symbols",
                },
              }}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <CustomInput
                    {...field}
                    type="password"
                    label="Password"
                    data-testid="password"
                    placeholder="Input your password"
                    autocomplete="new-password"
                    status={fieldState.invalid ? "error" : ""}
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* CONFIRM PASSWORD */}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              }}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <CustomInput
                    {...field}
                    type="password"
                    label="Confirm password"
                    data-testid="confirm-password"
                    placeholder="Input your password"
                    status={fieldState.invalid ? "error" : ""}
                  />

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* BUTTON */}

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
              {isSubmitting ? "Loading..." : "Sign up"}
            </button>

            {/* LOGIN */}

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth?mode=login"
                className="
                  font-medium
                  text-[#162d3a]
                  underline
                  transition
                  hover:opacity-70
                "
              >
                Sign in
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
