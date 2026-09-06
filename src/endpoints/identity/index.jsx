import { callRestApi } from "@/constants/server";
import { cookies } from "next/headers";

// Giải mã payload JWT (base64url): KHÔNG verify chữ ký và KHÔNG check exp,
// nên token hết hạn vẫn lấy được claims (chỉ dùng để hiển thị UI).
const decodeJwt = (token) => {
    if (!token) return {};
    try {
        const payload = token.split(".")[1];
        const json = Buffer.from(payload, "base64url").toString("utf8");
        return JSON.parse(json);
    } catch {
        return {};
    }
};

const toBool = (v) => String(v).toLowerCase() === "true";

export const loginGoogle = async ({ body, token }) => {
    return await callRestApi({
        method: "POST",
        endpoint: "/google/login",
        body,
        token,
    });
};

export const userInfo = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    var result = await callRestApi({
        method: "GET",
        endpoint: "/api/user/info",
        token,
    });

    // Quyền nằm trong JWT claims, không có trong response /api/user/info.
    const claims = decodeJwt(token);
    return {
        ...result,
        IS_ROOT: toBool(claims.IsRoot),
        IS_EDITER: toBool(claims.IsEditer),
        IS_EDITOR: toBool(claims.IsEditer),
    };
};

export const updateUserInfo = async ({ body, token }) => {
    return await callRestApi({
        method: "POST",
        endpoint: "/api/user-info/save",
        body,
        token,
    });
};
