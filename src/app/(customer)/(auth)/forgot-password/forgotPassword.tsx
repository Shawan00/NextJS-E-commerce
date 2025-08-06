"use client";

import SubmitButton from "@/components/admin/SubmitButton";
import { ForgotPasswordBody, ForgotPasswordBodyType } from "@/schemaValidation/auth.schema";
import { customerForgotPassword } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function ForgotPassword() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  })

  return (
    <>
      <form onSubmit={handleSubmit(customerForgotPassword)}
        className="container-custom-xl w-full"
      >
        <label className="label-custom mb-1"
          htmlFor="email"
        >Enter your email</label>
        <input 
          type="email"
          id="email"
          {...register('email')}
          className={`input-custom w-full`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
        <SubmitButton 
          label="Submit"
          pending={isSubmitting}
          className="mt-5 flex ml-auto"
        />
      </form>
    </>
  )
}

export default ForgotPassword;