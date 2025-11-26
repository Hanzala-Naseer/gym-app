import type React from "react"
import type { Metadata } from "next"
import { Poppins, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700", "900"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GYM Key - One Membership, 195+ Gyms Across Pakistan",
  description:
    "Access the best gyms across Lahore, Karachi, Islamabad and 11 other cities. One membership, unlimited gyms. Pakistan's largest gym network.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_poppins.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
