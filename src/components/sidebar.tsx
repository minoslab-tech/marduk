"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Users, FormIcon, BarChart, FlagTriangleRight, UserMinus, ShieldUser, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const menuItems = [
  {
    title: "Início",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Partidas",
    icon: FlagTriangleRight,
    href: "/dashboard/partidas",
  },
  {
    title: "Jogadores",
    icon: ShieldUser,
    href: "/dashboard/players",
  },
  {
    title: "Estatísticas",
    icon: BarChart,
    href: "/dashboard/statistics",
  },
  {
    title: "Meu Time",
    icon: Shield,
    href: "/dashboard/meutime",
  },
  {
    title: "Perfil",
    icon: Users,
    href: "/dashboard/profile",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-blue-600 text-white">
      {/* Logo Area */}
      <div className="flex h-24 items-center justify-center border-b border-white/10 px-6 bg-blue-600 ">
        <div className="flex items-center gap-3">
          {/* Logo Minos */}
          <Image
            src="/images/logo-minos-white.png"
            alt="Minos Logo"
            width={50}
            height={50}
            className="shrink-0"
          />
          {/* Nome Minos */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Minos</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/10",
                  isActive && "bg-white/15 text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
