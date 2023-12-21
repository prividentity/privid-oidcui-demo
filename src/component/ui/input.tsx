import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps | any>(
  ({ className, type, error, ...props }: any, ref) => {
    return (
      <>
        <input
          type={type}
          className={
            cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className
            ) + `${error && " !border-[#fb6e4f]"}`
          }
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-left mt-[2px] text-[14px] text-[#fb6e4f]">
            {error}
          </p>
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
