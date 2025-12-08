// src/actions/auth.ts
"use server";
import { getUserFromCookie } from "../lib/auth";

// BẮT BUỘC: Đánh dấu file này là Server Action



// Hàm này Client có thể gọi được
export async function getCurrentUser() {
    const user = await getUserFromCookie();
    return user;
}