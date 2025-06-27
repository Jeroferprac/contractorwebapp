'use client'

import React from "react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";

interface FileFieldProps {
  label: string;
  name: string;
  onFileChange: (file: File | null) => void;
}

const FileField: React.FC<FileFieldProps> = ({
  label,
  name,
  onFileChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="file"
        onChange={handleChange}
        className="mt-1"
      />
    </div>
  );
};

export default FileField;
