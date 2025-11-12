import { forwardRef } from "react";
import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "(65) 99999-9999", className }, ref) => {
    const isValid = (val: string) => {
      const numbers = val.replace(/\D/g, '');
      return numbers.length === 10 || numbers.length === 11;
    };

    return (
      <InputMask
        mask="(99) 99999-9999"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maskChar={null}
      >
        {/* @ts-ignore */}
        {(inputProps: any) => (
          <Input
            {...inputProps}
            ref={ref}
            type="tel"
            placeholder={placeholder}
            className={cn(
              isValid(value) && value ? "border-green-500 focus-visible:ring-green-500" : "",
              className
            )}
          />
        )}
      </InputMask>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
