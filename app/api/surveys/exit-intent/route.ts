import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: Request) {
  try {
    const { role, goal, blocker, email } = await req.json().catch(() => ({}))
    const sql = neon(process.env.DATABASE_URL as string)
    await sql`create table if not exists exit_intent_surveys (
      id serial primary key,
      role varchar(120),
      goal text,
      blocker text,
      email varchar(255),
      created_at timestamptz default now()
    )`;
    await sql`insert into exit_intent_surveys (role, goal, blocker, email) values (${role ?? null}, ${goal ?? null}, ${blocker ?? null}, ${email ?? null})`;
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


