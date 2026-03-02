import { callRestApi } from "@/constants/server";
import { cookies } from 'next/headers';

export const getOrders = async ({ query }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    return await callRestApi({ method: 'GET', endpoint: '/api/order/get', query, token })
};

