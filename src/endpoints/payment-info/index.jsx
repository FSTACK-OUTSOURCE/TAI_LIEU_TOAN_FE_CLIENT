import { callRestApi } from "@/constants/server";

export const getPaymentInfo = async () => {
    return await callRestApi({ method: 'GET', endpoint: '/api/payment-info/get' })
};
