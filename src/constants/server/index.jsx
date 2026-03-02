import axios from 'axios';


export const getConfig = (args) => {
    const { configs = [], name } = args;
    return configs.find(x => x.CONFIG_NAME == name)?.CONFIG_VALUE;
}

export const callRestApi = async (args) => {
    args.method = args.method || 'GET'

    const api = axios.create({
        baseURL: args.baseUrl || process.env.NEXT_PUBLIC_API_URL
    });

    api.interceptors.request.use(async (config) => {
        const token = args.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    const fnMethod = async (args) => {
        if (args.method == 'POST') {
            return await api.post(args.endpoint, args.body)
        }
        if (args.method == 'GET') {
            return await api.get(args.endpoint, { params: args.query })
        }
    }


    const result = async () => {
        try {
            const response = await fnMethod(args);
            return Promise.resolve({ ...response.data, success: true });
        } catch (error) {
            return Promise.resolve({ success: false, status: error.code == 'ECONNREFUSED' ? 500 : error?.response?.status, errors: error?.response?.data?.errors })
        }

    }
    return await result();

}