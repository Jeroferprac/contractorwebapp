import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type, register, error, required }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="font-medium">
        {label} {required && "*"}
      </label>
      <input
        id={name}
        type={type}
        {...register}
        className="border p-2 rounded"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FormField;
