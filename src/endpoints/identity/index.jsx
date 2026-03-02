import { callRestApi } from "@/constants/server";
import { cookies } from 'next/headers';

export const loginGoogle = async ({ body, token }) => {
    return await callRestApi({ method: 'POST', endpoint: '/google/login', body, token })
};

export const userInfo = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    var result = await callRestApi({ method: 'GET', endpoint: '/api/user/info', token })
    return result;
};

export const updateUserInfo = async ({ body, token }) => {
    return await callRestApi({ method: 'POST', endpoint: '/api/user-info/save', body, token })
};