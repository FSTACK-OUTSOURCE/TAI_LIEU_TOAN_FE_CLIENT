import DocumentSearch from "@/components/documentSearch";
import { getDocuments } from "@/endpoints/document";

const fetchDocuments = async ({ query }) => {
    var response = await getDocuments({ query });
    return response.success ? response.Items : []
}

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const keyword = params.keyword || '';

    // Server-side fetching
    const documents = await fetchDocuments({ query: { NAME: keyword, IS_HIDDEN: false } });

    return <div className=""><DocumentSearch documents={documents} /></div>
}