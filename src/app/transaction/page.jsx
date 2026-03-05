
const { getTransactions } = require("@/endpoints/transaction")
import MainTempalte from '@/components/mainTempalte';
import TransactionItem from '@/components/transactionitem';

const fetchTransactions = async () => {
    var response = await getTransactions({ query: {} });
    return response.success ? response.Items : []
}

export default async function Page({
    params,
}) {

    const transactions = await fetchTransactions()


    return (
        <MainTempalte>
        <section>
            <div className="section-heading mt-3 pt-3 pb-3 mb-3 filterListFile">
                <div className="titleDocumentPage row form-group">
                    <div className="col-md-12">
                        <label>Lịch sử giao dịch</label>
                    </div>
                </div>
            </div>
            <TransactionItem props={{ transactions }} />
        </section>
        </MainTempalte>
    );
}