"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  label = "Submit", className, isDisabled
}: {
  label?: string;
  className?: string;
  isDisabled?: boolean;
}) {

  const {pending} = useFormStatus();

  return (
    <Button
      variant={"ghost"}
      type="submit" 
      className={`!text-secondary text-base p-5 bg-accent cursor-pointer 
        hover:bg-accent/95 active:scale-98
        ${className}`}
      disabled={isDisabled || pending}
    >
      {pending ? (
        <>
          <Loader2 className="animated-spin"/>
          <span>Please wait</span>
        </>
      ) : (
        <>{label}</>
      )}
    </Button>
  );
}