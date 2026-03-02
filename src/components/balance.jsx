'use client'
import { useRouter } from 'next/navigation'
import { useAppContext } from "@/appcontext";


const Balance = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();
    return (
        appcontext.username ?
            <>
                <div className="card mt-3">
                    <div className="card-body">
                        <img src="/coin.png" width={30} height={30} /><i className="bi-cash-coin m-1"></i><b>Số dư: </b><span className="fw-bold text-danger">{new Intl.NumberFormat('vi-VN').format(appcontext.balance)} đ</span>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-body">
                        <button style={{ border: 'none', background: 'none' }} onClick={() => {
                            router.push(`/bought`, { scroll: false })
                        }}>
                            <img src="/inbox.png" width={30} height={30} /><i className="bi-cash-coin m-1"></i><b>Tài liệu đã mua (<span className="fw-bold text-danger">{appcontext.bought}</span>)</b>
                        </button>
                    </div>
                </div>
            </> :
            <></>

    );
}

export default Balance;