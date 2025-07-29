import { http } from "@/lib/htpp";
import { Customer, CustomerLoginResType, LoginBody } from "@/schemaValidation/auth.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestData = await req.json();
  const parsedData = LoginBody.safeParse(requestData);

  if (parsedData.error) {
    return NextResponse.json({
      status: 401,
      payload: {
        message: "Input error"
      }
    }, { status: 401 })
  }
  const response = await http.post<CustomerLoginResType>('/auth/login', parsedData.data)

  try {
    if (response.status === 200 && 'customer' in response.payload) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'customer',
        value: JSON.stringify(Customer.parse(response.payload.customer)),
        httpOnly: true,
        path: "/",
        secure: true
      })
    }
    return NextResponse.json(response, { status: response.status })
  } catch (_error) {
    return NextResponse.json({
      status: 400,
      payload: {
        message: "Something wrong with server or database"
      }
    }, { status: 400 })
  }
}