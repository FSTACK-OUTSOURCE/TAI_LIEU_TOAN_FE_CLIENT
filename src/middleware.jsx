import { NextResponse } from "next/server";

export function middleware(request) {
    const pathname = request.nextUrl.pathname;

    // Xử lý backslash uploads
    if (pathname.includes("%5C") || pathname.includes("\\")) {
        const normalized = pathname.replace(/%5C|\\+/g, "/");
        if (normalized.includes("/uploads/")) {
            const filename = normalized.split("/uploads/")[1];
            return NextResponse.redirect(
                `https://api.tailieutoan.vn/uploads/${filename}`,
            );
        }
    }

    // Logic cũ giữ nguyên
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: "/:path*",
};
