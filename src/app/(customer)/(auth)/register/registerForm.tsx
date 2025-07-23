"use client";

import { useState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { Eye, EyeClosed, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidation/auth.schema";
import { customerRegister } from "@/service/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const validatePasswordConditions = {
  length: 'At least 8 characters long',
  uppercase: 'At least one uppercase letter',
  lowercase: 'At least one lowercase letter',
  number: 'At least one number',
  specialChar: 'At least one special character',
}

function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(customerRegister)}>
      <div className="mb-4">
        <label htmlFor="fullName" className="label-custom">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          placeholder="An Quốc Việt"
          className={`input-custom`}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-[var(--tertiary)] text-sm mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="label-custom">
          Email address
        </label>
        <input
          type="email"
          id="email"
          placeholder="test@example.com"
          className="input-custom"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-[var(--tertiary)] text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Tooltip>
          <TooltipTrigger>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 flex gap-1 items-center"
            >
              Password
              <Info className="!size-3" />
            </label>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <ul className="list-disc pl-5">
                {Object.values(validatePasswordConditions).map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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

      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          >
            {showConfirmPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[var(--tertiary)] text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <SubmitButton
        label="Register"
        pending={isSubmitting}
        className="w-full" />
    </form>
  );
};

export default RegistrationForm;
