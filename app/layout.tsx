import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Daily Schedule App",
  description: "Manage your daily construction tasks",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <InitDatabase />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

// Client component to initialize database
function InitDatabase() {
  // Use client-side effect to initialize database
  if (typeof window !== "undefined") {
    fetch("/api/init")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Database initialized successfully")
        } else {
          console.error("Database initialization failed:", data.message)
        }
      })
      .catch((err) => {
        console.error("Error initializing database:", err)
      })
  }

  return null
}
