// src/config/menu.ts
import { Home, Users, Banknote, FileArchive, Phone } from "lucide-react"
// importe seu próprio ícone
// import { FormIcon } from "@/components/icons/form-icon"

export type MenuItem = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  hasSubmenu?: boolean
  submenuItems?: {
    title: string
    href: string
  }[]
}

export const menuItems: MenuItem[] = [
  {
    title: "Início",
    icon: Home,
    href: "/",
  },
  {
    title: "Partidas",
    icon: Users,
    href: "/dashboard/matches",
  },
  {
    title: "Financeiro",
    icon: Banknote,
    href: "/finance",
    hasSubmenu: true,
    submenuItems: [
      { title: "Visão geral", href: "/finance" },
      { title: "Receitas", href: "/finance/income" },
      { title: "Despesas", href: "/finance/expenses" },
    ],
  },
  {
    title: "Cadastros",
    icon: Users, // troque pelo FormIcon se já tiver
    href: "/register",
  },
  {
    title: "Relatórios",
    icon: FileArchive,
    href: "/relatorios",
  },
  {
    title: "Ajuda / Suporte",
    icon: Phone,
    href: "/help",
    hasSubmenu: true,
    submenuItems: [
      { title: "Central de ajuda", href: "/help" },
      { title: "Abrir chamado", href: "/help/ticket" },
    ],
  },
  {
    title: "Meu Perfil",
    icon: Users,
    href: "/profile",
  },
]
