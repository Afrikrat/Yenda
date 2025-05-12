"use client"

import type React from "react"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style jsx global>{`
        /* Hide bottom navigation in admin login */
        .admin-login-section .bottom-navigation {
          display: none !important;
        }
      `}</style>
      <div className="admin-login-section">{children}</div>
    </>
  )
}
