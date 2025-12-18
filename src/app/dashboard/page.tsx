"use client"

import { useState, useEffect } from "react"
import { FirstAccessModal } from "@/components/first-access-modal"

export default function DashboardPage() {
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false)

  useEffect(() => {
    const hasCompletedFirstAccess = localStorage.getItem("hasCompletedFirstAccess")

    if (!hasCompletedFirstAccess) {
      setShowFirstAccessModal(true)
    }
  }, [])

  const handleFirstAccessComplete = async (data: any) => {
    try {
      localStorage.setItem("hasCompletedFirstAccess", "true")
      setShowFirstAccessModal(false)

      console.log("Dados do primeiro acesso:", data)
    } catch (error) {
      console.error("Erro ao completar primeiro acesso:", error)
    }
  }

  return (
    <div>
      <FirstAccessModal
        open={showFirstAccessModal}
        onComplete={handleFirstAccessComplete}
      />
    </div>
  )
}
