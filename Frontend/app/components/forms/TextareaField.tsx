import React from "react";
import {Label} from "../ui/label";
import {Textarea} from "../ui/textarea";

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <Textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1"
      rows={4}
    />
  </div>
);

export default TextareaField;
