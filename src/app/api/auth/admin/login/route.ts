import { http } from "@/lib/htpp";
import { Admin, AdminLoginResType, LoginBody } from "@/schemaValidation/auth.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.json();
  const parsedData = LoginBody.safeParse(reqData)

  if (parsedData.error) {
    return NextResponse.json({
      status: 401,
      payload: {
        message: "Input error"
      }
    }, {status: 401})
  }
  const response = await http.post<AdminLoginResType>('/auth/admin/login', parsedData.data)

  try {
    if (response.status === 200 && 'admin' in response.payload) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'admin',
        value: JSON.stringify(Admin.parse(response.payload.admin)),
        httpOnly: true,
        path: "/",
        secure: true
      })
    }
    return NextResponse.json(response, {status: response.status})
  } catch (error) {
    return NextResponse.json({
      status: 400,
      payload: {
        message: "Something wrong with server or database"
      }
    }, {status: 400})
  }
  
}

export async function GET() {
  return NextResponse.json({message: "hello"})
}