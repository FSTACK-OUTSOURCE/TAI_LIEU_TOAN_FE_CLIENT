'use client'
import { useRouter } from 'next/navigation'
import { useAppContext } from "@/appcontext";
import ModalRecharge from './modalRecharge';
import { useState } from 'react';


const Balance = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();

    const [showTopup, setShowTopup] = useState(false);

    const handleOk = () => {
        setShowTopup(false);
    };

    const handleCancel = () => {
        setShowTopup(false);
    };

    return (
        appcontext.username ?
            <>
                <div className="card mt-3" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="card-body">
                        <img src="/coin.png" width={30} height={30} /><i className="bi-cash-coin m-1"></i><b>Số dư: </b><span className="fw-bold text-danger">{new Intl.NumberFormat('vi-VN').format(appcontext.balance)} đ</span>
                    </div>
                    <button className='btn btn-primary' style={{ marginRight: '8px', fontSize:"14px" }} onClick={() => {
                        setShowTopup(true)
                    }}>Nạp tiền</button>
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
                <ModalRecharge showTopup={showTopup} handleOk={handleOk} handleCancel={handleCancel} />
            </> :
            <></>

    );
}

export default Balance;