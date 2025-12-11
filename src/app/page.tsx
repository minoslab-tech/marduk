import { prisma } from "@/lib/db";

export default async function Home() {
  // Database call
  const users = await prisma.user.findMany()
  return (
    <main>
      <h1>Users</h1>
      <pre>
        {JSON.stringify(users, null, 2)}
      </pre>
    </main>
  );
}