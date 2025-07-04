"use client"

import { toast as shadToast } from "@/components/ui/use-toast"

export function useToastNotification() {
  const notifySuccess = (title: string, description?: string) => {
    shadToast({
      title,
      description,
    })
  }

  const notifyError = (title: string, description?: string) => {
    shadToast({
      title,
      description,
      variant: "destructive",
    })
  }

  return { notifySuccess, notifyError }
}
