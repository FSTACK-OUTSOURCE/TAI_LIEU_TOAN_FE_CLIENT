import { Breadcrumb } from 'antd';
import { getDocuments, getParentDocuments } from '@/endpoints/document';
import { getTopics } from '@/endpoints/topic';
import BreadCrumbItem from '@/components/breadcrumbitem';
import DocumentAction from '@/components/documentaction';
import Description from '@/components/description';
import DocumentItem from '@/components/documentitem';
import DocumentDetail from '@/components/documentDetail';

const fetchDocuments = async ({ query }) => {
    var response = await getDocuments({ query });
    return response.success ? response.Items : []
}

const fetchBreadCrumb = async (documentId) => {
    if (documentId) {
        var response = await getParentDocuments({ query: { DOCUMENT_IDS: documentId, Columns: '*' } })
        if (response.success) {
            var rootParent = response.Data[0]
            var result = response.Data.map((item) => {
                return {
                    title: <BreadCrumbItem props={{ item, rootParent }} />, documentId: item.DOCUMENT_ID
                }
            })
            return result;
        }
    }
    return []
}

const fetchDocument = async (identityKey) => {
    var documents = await fetchDocuments({ query: { IDENTITY_KEY: identityKey, Columns: 'BOUGHT' } })
    return documents.length > 0 ? documents[0] : {}
}

const fetchChildDocuments = async (documentId) => {
    var childDocuments = await fetchDocuments({ query: { PARENT_DOCUMENT_ID: documentId, Columns: 'BOUGHT,ROOT_PARENT' } })
    return childDocuments;
}

const fetchTopics = async (documentId) => {
    if (documentId) {
        var response = await getTopics({ query: { DOCUMENT_ID: documentId, PageSize: 100 } })
        if (response.success) {
            return response.Items
        }
    }
    return []
}

export default async function Page({
    params,
}) {
    const { slug } = await params;
    const identityKey = slug[slug.length - 1].split('-').pop();
    if (!identityKey) {
        return <h1>404 - Page Not Found</h1>
    }
    const documentinfo = await fetchDocument(identityKey)
    const breadData = await fetchBreadCrumb(documentinfo.DOCUMENT_ID);
    var childDocuments = await fetchChildDocuments(documentinfo.DOCUMENT_ID)
    const topics = childDocuments.length > 0 ? await fetchTopics(documentinfo.DOCUMENT_ID) : []
    console.log("documentinfo", documentinfo)
    // console.log("breadData", breadData)
    // console.log("childDocuments", childDocuments)
    // console.log("topics", topics)

    return (
        <section>
            <div className="section-heading mt-3 pt-3 pb-3 mb-3 filterListFile">
                {breadData ? <Breadcrumb
                    items={breadData}
                /> : <></>}
            </div>
            {/* <DocumentDetail/> */}
            <div className="section-heading mt-3 pt-3 pb-3 mb-3 filterListFile">
                <DocumentAction props={{ documentinfo }} />
            </div>
            <Description props={{ documentinfo }} />
            <DocumentItem props={{ documentinfo: { childDocuments, ...documentinfo }, topics }} />
        </section>
    );
}