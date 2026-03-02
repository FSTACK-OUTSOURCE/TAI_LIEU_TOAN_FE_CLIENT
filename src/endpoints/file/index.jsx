import { callRestApi } from "@/constants/server";

export const getPdfLink = async ({ query, token }) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/file/download-pdf', query, token })
};

