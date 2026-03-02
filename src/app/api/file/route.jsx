import axios from 'axios';
import { NextResponse } from 'next/server';
import { getPdfLink } from '@/endpoints/file';
import { cookies } from 'next/headers';

export async function GET(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const documentid = searchParams.get('documentid');


    var fileResponse = await getPdfLink({ query: { DocumentId: documentid }, token })
    if (!fileResponse.success) {
        return NextResponse.json(
            fileResponse,
            { status: fileResponse.status }
        );
    }
    try {
        const response = await axios({
            url: fileResponse.Url,
            method: 'GET',
            responseType: 'stream',
        });

        const contentType = response.headers['content-type'];

        const headers = new Headers({
            'Content-Type': contentType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileResponse.FileName}${fileResponse.Extension}"`,
        });

        return new Response(response.data, { headers });
    } catch (error) {
        return NextResponse.json(
            { errors: ['Failed to download the file'] },
            { status: 500 }
        );
    }

}