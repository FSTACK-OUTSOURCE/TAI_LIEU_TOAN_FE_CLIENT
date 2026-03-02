import axios from 'axios';
import { NextResponse } from 'next/server';
import { buyDocument } from '@/endpoints/document';
import { cookies } from 'next/headers';

export async function GET(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const { searchParams } = new URL(request.url);
    const documentid = searchParams.get('documentid');


    var fileResponse = await buyDocument({ query: { DOCUMENT_ID: documentid }, token })
    return NextResponse.json(
        fileResponse,
        { status: fileResponse.status }
    );

}