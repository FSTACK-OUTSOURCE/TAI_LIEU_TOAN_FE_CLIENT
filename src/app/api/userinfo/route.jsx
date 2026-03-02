import { updateUserInfo } from '@/endpoints/identity';
import { cookies } from 'next/headers';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    var body = searchParams.get('body');

    const cookieStore = await cookies();

    const token = cookieStore.get('access_token')?.value;
    body = JSON.parse(body)
    var updateResponse = await updateUserInfo({ body, token })
    const headers = new Headers({
        'Content-Type': 'application/json'
    });
    if (updateResponse.success) {
        return new Response(JSON.stringify(updateResponse), {
            status: 200,
            headers,
        });
    }
    else {
        return new Response('Đăng nhập thất bại', {
            status: 400,
            headers,
        });
    }

}


