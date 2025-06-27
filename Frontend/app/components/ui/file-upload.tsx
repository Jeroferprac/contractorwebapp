'use client'

import { useState } from 'react'

export default function FileUpload({ onChange }: { onChange: (file: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        onChange(base64)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Max file size is 10MB')
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" className="mt-2 h-32 rounded" />}
    </div>
  )
}
