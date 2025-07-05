import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, register, error, required }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="font-medium">
        {label} {required && "*"}
      </label>
      <textarea
        id={name}
        {...register}
        className="border p-2 rounded"
        rows={4}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default TextareaField;
