import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const {name} = await params
  try {
    const cookieStore = await cookies();
    const data = cookieStore.get(name);
    if (data !== undefined) {
      return NextResponse.json(data.value, { status: 200 })
    } else {
      return NextResponse.json({undefined}, { status: 404 })
    }
  } catch (erorr) {
    console.log("Get cookie error: ", erorr);
    return NextResponse.json({ message: "An unknow error" }, { status: 500 })
  }
}