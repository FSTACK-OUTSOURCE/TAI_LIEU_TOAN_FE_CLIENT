import { callRestApi } from "@/constants/server";

export const getConfigs = async () => {
    return await callRestApi({ method: 'GET', endpoint: '/api/config/get' })
};