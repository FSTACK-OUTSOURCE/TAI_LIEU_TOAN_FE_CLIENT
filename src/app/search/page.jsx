import DocumentSearch from "@/components/documentSearch";
import { getDocuments } from "@/endpoints/document";

const fetchDocuments = async ({ query }) => {
    var response = await getDocuments({ query });
    return response.success ? response.Items : []
}

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const keyword = params.keyword || '';

    const query = { NAME: keyword, IS_HIDDEN: false };
    if (params.price === '0') {
        query.PRICE = 0;
    }

    // Server-side fetching
    const documents = await fetchDocuments({ query });

    return <div className=""><DocumentSearch documents={documents} /></div>
}