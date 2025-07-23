import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('customer');
  return NextResponse.json({message: "Your account was logged out"}, {status: 200});
}