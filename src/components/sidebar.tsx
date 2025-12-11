"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Menu, ChevronDown } from "lucide-react"
import { MenuItem, menuItems } from "@/config/menu"


type SidebarProps = {
  items?: MenuItem[]
}

const SidebarInner: React.FC<SidebarProps> = ({ items = menuItems }) => {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-blue-500 backdrop-blur-md text-white">
      {/* LOGO / HEADER */}
      <div className="flex items-center gap-2 border-b px-4 h-16">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-500 font-semibold">
          FT
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">
            Futebol Pro
          </span>
          <span className="text-xs text-white">
            Painel do treinador
          </span>
        </div>
      </div>

      {/* MENU */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 px-2 py-3">
          <Accordion
            type="multiple"
            className="space-y-1"
          >
            {items.map((item) => {
              const isActive =
                item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))

              if (item.hasSubmenu && item.submenuItems && item.submenuItems.length > 0) {
                return (
                  <AccordionItem
                    key={item.title}
                    value={item.title}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium transition-all",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 space-y-1 pl-8">
                      {item.submenuItems.map((sub) => {
                        const isSubActive =
                          pathname === sub.href || pathname.startsWith(sub.href + "/")
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-xs transition-colors",
                              "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                              isSubActive &&
                                "bg-accent/80 text-accent-foreground"
                            )}
                          >
                            {sub.title}
                          </Link>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                )
              }

              // item sem submenu
              return (
                <TooltipProvider key={item.title}>
                  <Tooltip delayDuration={400}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href ?? "#"}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </Accordion>
        </nav>
      </ScrollArea>

      {/* FOOTER / INFO DO USUÁRIO */}
      <div className="border-t px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-500">
              HA
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Henrique</span>
              <span className="text-[10px] text-white">
                Treinador principal
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white"
          >
            <span className="sr-only">Abrir configurações</span>
            {/* Poderia ser um ícone de engrenagem aqui */}
            •••
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar(props: SidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* MOBILE */}
      <div className="flex items-center gap-2 border-b bg-background px-3 py-2 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-72 flex-col p-0"
          >
            <SidebarInner {...props} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">
            Painel
          </span>
          <span className="text-xs text-white">
            Gestão de time amador
          </span>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden h-screen w-64 lg:block">
        <SidebarInner {...props} />
      </div>
    </>
  )
}
