import { callRestApi } from "@/constants/server";
import { cookies } from 'next/headers';


export const getDocuments = async ({ query }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    return await callRestApi({ method: 'GET', endpoint: '/api/document/get', query, token })
};

export const getParentDocuments = async ({ query }) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/document/get-parent', query })
};

export const buyDocument = async ({ query, token }) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/document/buy', query, token })
};

export const getHistoryDocuments = async ({ query }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    return await callRestApi({ method: 'GET', endpoint: '/api/document/history', query, token })
};