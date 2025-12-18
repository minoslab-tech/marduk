'use client';
import { usePathname } from 'next/navigation';
import React from 'react'

export const InfoCurrentPage = () => {

  const pathname = usePathname();

  function defineTitleBasedOnPathname() {
    switch (pathname) {
      case "/dashboard":
        return { title: "Início", description: "Visão geral do sistema" };
      case "/dashboard/users":
        return { title: "Usuários", description: "Gerencie os usuários aqui" };
      case "/dashboard/finance":
        return { title: "Financeiro", description: "Visão geral financeira" };
      case "/dashboard/register":
        return { title: "Cadastros", description: "Gerencie os cadastros aqui" };
      case "/dashboard/players":
        return { title: "Jogadores", description: "Visualize os jogadores aqui" };
      case "/dashboard/help":
        return { title: "Ajuda / Suporte", description: "Obtenha ajuda e suporte aqui" };
      case "/dashboard/profile":
        return { title: "Meu Perfil", description: "Gerencie seu perfil aqui" };
    }
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{defineTitleBasedOnPathname()?.title}</h1>
      <p className="mt-2 text-gray-600">
        {defineTitleBasedOnPathname()?.description}
      </p>
    </div>
  )
}
