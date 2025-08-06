"use client";

import SubmitButton from "@/components/admin/SubmitButton";
import { ResetPasswordBody, ResetPasswordBodyType } from "@/schemaValidation/auth.schema";
import { customerResetPassword } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function ResetPassword({email}: {email: string}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  })

  return (
    <>
      <form onSubmit={handleSubmit(customerResetPassword)}>
        <input 
          type="email"
          id="email"
          value={email}
          disabled
          {...register('email')}
          className={`hidden`}
        />
        <label htmlFor="otp" className="label-custom">Code</label>
        <input 
          type="number"
          id="otp"
          {...register('otp')}
          className={`input-custom [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]`}
        />
        {errors.otp && (
          <p className="text-red-500 text-sm">
            {errors.otp.message}
          </p>
        )}
        <label htmlFor="newPassword" className="label-custom mt-4">New Password</label>
        <input 
          type="password" 
          id="newPassword" 
          {...register('newPassword')} 
          className={`input-custom`} 
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">
            {errors.newPassword.message}
          </p>
        )}
        <label htmlFor="confirmPassword" className="label-custom mt-4">Confirm Password</label>
        <input type="password" id="confirmPassword" {...register('confirmPassword')} className={`input-custom`} />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
        <SubmitButton
          label="Reset Password"
          pending={isSubmitting}
          className="mt-5 flex ml-auto"
        />
      </form>
    </>
  )
}

export default ResetPassword;