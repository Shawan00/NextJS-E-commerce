import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('admin');

  return NextResponse.json({message: "Logout successfully"}, {status: 200})
}