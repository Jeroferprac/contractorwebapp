import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { UserSyncer } from "@/components/UserSyncer"
import { Toaster } from "./components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ContractorHub",
  description: "Manage clients, quotes and projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <UserSyncer />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
