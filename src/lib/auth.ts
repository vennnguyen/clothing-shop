// lib/auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getUserFromCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);

        return {
            id: payload.id,
            name: payload.name as string,
            email: payload.email as string,
            role: payload.role as string,
        };
    } catch (error) {
        return null; // Token lỗi hoặc hết hạn
    }
}