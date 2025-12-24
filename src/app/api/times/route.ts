import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { times } from "@/db/schema"
import { asc } from "drizzle-orm"

// GET - Listar times
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const timesList = await db
      .select()
      .from(times)
      .orderBy(asc(times.nome))

    return NextResponse.json(timesList)
  } catch (error) {
    console.error("Erro ao listar times:", error)
    return NextResponse.json(
      { error: "Erro ao listar times" },
      { status: 500 }
    )
  }
}
