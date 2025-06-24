'use client'

import { UseFormRegisterReturn } from 'react-hook-form'

type Props = {
  label: string
  register: UseFormRegisterReturn
  error?: { message?: string }
} & React.InputHTMLAttributes<HTMLInputElement>

export default function FormField({ label, register, error, ...props }: Props) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input {...register} {...props} className="border px-2 py-1 w-full" />
      {error?.message && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}
