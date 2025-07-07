import React from "react";

interface FileFieldProps {
  label: string;
  name: string;
  onFileChange: (file: File | null) => void;
}

const FileField: React.FC<FileFieldProps> = ({ label, name, onFileChange }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <input
        id={name}
        type="file"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default FileField;
