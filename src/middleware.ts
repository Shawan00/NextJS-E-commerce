import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const dataAdmin = cookieStore.get('admin');
  const dataCustomer = cookieStore.get('customer');

  try {
    const {pathname} = req.nextUrl;
    if (pathname !== "/admin/login" && pathname.startsWith('/admin') && dataAdmin === undefined) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (pathname.startsWith('/me') && dataCustomer === undefined) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }

}

export const config = {
  matcher: ['/admin/:path*', '/me/:path*']
}