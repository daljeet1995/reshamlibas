import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check karo ki user /admin route par hai ya nahi
  if (request.nextUrl.pathname.startsWith("/admin")) {
    
    // URL mein check karo ki kya '?key=admin123' laga hai
    const urlKey = request.nextUrl.searchParams.get("key");

    // Agar key nahi hai ya galat hai, toh 404 dikha do
    if (urlKey !== "admin123") {
      return new NextResponse("Page Not Found (404)", { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};