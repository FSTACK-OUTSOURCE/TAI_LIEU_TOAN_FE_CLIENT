import DocumentHistoryItem from "@/components/documenthistoryitem";
import MainTempalte from "@/components/mainTempalte";

const { getHistoryDocuments } = require("@/endpoints/document")

const fetchDocumentBought = async () => {
    var response = await getHistoryDocuments({ query: {Columns: "ROOT_PARENT"} });
    return response.success ? response.Items : []
}

export default async function Page({
    params,
}) {

    const documents = await fetchDocumentBought()

    return (
        <MainTempalte>
        <section>
            <div className="section-heading mt-3 pt-3 pb-3 mb-3 filterListFile">
                <div className="titleDocumentPage row form-group">
                    <div className="col-md-12">
                        <label>Tài liệu đã mua</label>
                    </div>
                </div>
            </div>
            <DocumentHistoryItem props={{ documents }} />
        </section>
        </MainTempalte>
    );
}