import { callRestApi } from "@/constants/server";

export const getBlogs = async ({ query } = {}) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/blog/get', query });
};
