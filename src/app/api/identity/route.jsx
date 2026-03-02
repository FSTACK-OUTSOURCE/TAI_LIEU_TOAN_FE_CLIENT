import { loginGoogle, updateUserInfo } from '@/endpoints/identity';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idtoken = searchParams.get('idtoken');

    var loginResponse = await loginGoogle({ body: { ID_TOKEN: idtoken } })
    const headers = new Headers({
        'Content-Type': 'application/json'
    });
    if (loginResponse.success) {
        headers.append('Set-Cookie', `access_token=${loginResponse.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`);
        return new Response(JSON.stringify(loginResponse.userinfo), {
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

export const POST = async (request) => {
    const body = await request.json()
    const cookieStore = await cookies();

    const token = cookieStore.get('access_token')?.value;
    var updateResponse = await updateUserInfo({ body, token })

    if (updateResponse.success) {
        return NextResponse.json(
            updateResponse,
            { status: updateResponse.status }
        );
    }
    else {
        return NextResponse.json(
            updateResponse,
            { status: 200 }
        );
    }
}

