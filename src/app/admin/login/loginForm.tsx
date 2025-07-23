"use client"

import SubmitButton from "@/components/admin/SubmitButton"
import { Checkbox } from "@/components/ui/checkbox"
import { LoginBody, LoginBodyType } from "@/schemaValidation/auth.schema";
import { adminLogin } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react"
import { useForm } from "react-hook-form";

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    mode: "onChange",
    reValidateMode: "onBlur"
  })

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(adminLogin)}>
        <div>
          <label
            htmlFor="email"
            className="label-custom"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              defaultValue={'admin@gmail.com'}
              className="input-custom"
              placeholder="you@example.com"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[var(--tertiary)] text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="label-custom"
          >
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              defaultValue={'Test@123'}
              className="input-custom"
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[var(--tertiary)] text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox id='remember-me' />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-primary"
            >
              Remember me
            </label>
          </div>
        </div>

        <SubmitButton
          label="Login as admin"
          pending={isSubmitting}
          className='w-full' 
        />
      </form>
    </>
  )
}

export default LoginForm