import { Suspense } from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="h-96" />}>
            {children}
          </Suspense>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden bg-gradient-to-br from-blue-600 to-blue-800 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-8">
        <div className="text-center text-white">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/minos-logo.png"
              alt="Minos Logo"
              width={120}
              height={120}
              className="drop-shadow-2xl"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Minos</h1>
          <p className="mb-8 text-xl text-blue-100">Sistema de Gestão</p>
          <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm leading-relaxed">
              Plataforma completa para gerenciamento de vagas em creches e
              instituições educacionais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
