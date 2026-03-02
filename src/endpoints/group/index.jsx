import { callRestApi } from "@/constants/server";

export const getGroups = async ({ query }) => {
    return await callRestApi({ method: 'GET', endpoint: '/api/group/get', query })
};

