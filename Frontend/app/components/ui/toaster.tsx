"use client"

import { useToast } from "@/components/ui/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let icon = null;
        if (variant === "success") icon = <CheckCircle className="w-5 h-5 text-green-500 mr-2" />;
        else if (variant === "error") icon = <XCircle className="w-5 h-5 text-red-500 mr-2" />;
        else if (variant === "info") icon = <Info className="w-5 h-5 text-blue-500 mr-2" />;
        else if (variant === "warning") icon = <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />;
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  <span className="flex items-center">
                    {icon}
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
