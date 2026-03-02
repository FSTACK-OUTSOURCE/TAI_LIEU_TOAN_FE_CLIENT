import { callRestApi } from "@/constants/server";

export const getTopics = async ({ query }) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/topic/get', query })
};
