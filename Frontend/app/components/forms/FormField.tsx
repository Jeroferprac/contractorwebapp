'use client'

import React from "react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import { cn } from "@/lib/utils"
import { UseFormRegisterReturn } from "react-hook-form"

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div className="mb-4">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={cn(
        "w-full p-2 rounded border outline-none focus:ring-2",
        "border-gray-300 bg-white focus:ring-blue-300"
      )}
    />
  </div>
);

export default FormField;
