'use client'

import { Modal, Button } from "antd";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from '@ant-design/icons';
import './styles/modalRecharge.css';
import { getPaymentInfo } from "@/endpoints/payment-info";
import { AccountNumber, AdminPhoneNumber, BankName } from "@/constants/dataCommon";

const ModalRecharge = ({ showTopup, handleOk, handleCancel }) => {
    const [listBudget, setListBudget] = useState([]);

    useEffect(() => {
        getPaymentInfo().then(res => {
            if (res?.Items?.length > 0) {
                setListBudget(res.Items.map(item => ({
                    value: Number(item.VALUE),
                    label: `${Number(item.VALUE).toLocaleString('vi-VN')} đ`,
                    qrUrl: item.QR_URL ? `${process.env.NEXT_PUBLIC_API_URL}${item.QR_URL}` : null,
                })));
            }
        });
    }, []);

    const [budgetSelected, setBudgetSelected] = useState(null)

    const handleClose = () => {
        setBudgetSelected(null);
        handleCancel();
    };

    const handleSupport = () =>{

    }

    const selectedItem = listBudget.find(i => i.value === budgetSelected);

    return (
        <Modal
            title={<span style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>Nạp tiền vào tài khoản</span>}
            open={showTopup}
            onOk={handleOk}
            onCancel={handleClose}
            width={900}
            footer={null}
            centered
        >
            <div className="modal-recharge-container">
                {budgetSelected ? (
                    <div className="payment-method-container">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
                            <ArrowLeftOutlined
                                style={{ fontSize: '18px', cursor: 'pointer', color: '#555' }}
                                onClick={() => setBudgetSelected(null)}
                            />
                            <span style={{ color: '#e5a100', fontSize: '16px' }}>Chọn phương thức thanh toán phù hợp</span>
                        </div>

                        <div className="payment-split-layout">
                            {/* Left Column */}
                            <div className="payment-left-col">
                                <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '20px' }}>
                                    Nạp <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN').format(budgetSelected)}đ</span> vào tài khoản
                                </h3>

                                <div className="payment-instruction-box">
                                    Dùng phần mềm quét mã QR trong ứng dụng ngân hàng để quét mã sau
                                </div>

                                <div className="payment-instruction-box">
                                    Sau khi thanh toán thành công quý khách vui lòng chụp lại giao dịch và gửi đến zalo: <span style={{color:"red"}}>{AdminPhoneNumber}</span>
                                </div>

                                <table className="payment-info-table">
                                    <tbody>
                                        <tr>
                                            <td className="info-label">Tên tài khoản:</td>
                                            <td className="info-value">{BankName}</td>
                                        </tr>
                                        <tr>
                                            <td className="info-label">Số tài khoản:</td>
                                            <td className="info-value">{AccountNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="info-label">Ngân hàng:</td>
                                            <td className="info-value">
                                                <img src="/mbbank-logo.png" style={{width:"50px"}}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="info-label">Số tiền:</td>
                                            <td className="info-value">{new Intl.NumberFormat('vi-VN').format(budgetSelected)} vnđ</td>
                                        </tr>
                                        {/* <tr>
                                            <td className="info-label">Nội dung bắt buộc*:</td>
                                            <td className="info-value" style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px' }}>TLC1293851772899142</td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>

                            {/* Right Column */}
                            <div className="payment-right-col">
                                <div className="qr-code-wrapper">
                                    {selectedItem?.qrUrl && (
                                        <img
                                            src={selectedItem.qrUrl}
                                            alt="QR Code"
                                            style={{ width: '100%', maxWidth: 220, height: 'auto', objectFit: 'contain' }}
                                        />
                                    )}
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <a href="#" style={{ color: '#1890ff', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>Hướng dẫn quét mã QR</a>
                                    {/* <p style={{ marginTop: '16px', fontSize: '13px', color: '#555', padding: '0 10px', lineHeight: '1.5' }}>
                                        Vui lòng giữ nguyên cửa sổ này và chờ 2-3 giây sau khi quét mã xong để giao dịch hoàn tất tự động
                                    </p> */}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <img src="/ho_tro_ki_thuat.png" alt="zalo" style={{ width: '150px', objectFit: 'contain', cursor:"pointer" }} onClick={handleSupport} />
                        </div>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: '16px', color: '#555', marginBottom: '16px' }}>
                            Vui lòng chọn hoặc nhập số tiền bạn muốn nạp vào tài khoản:
                        </p>
                        <div className="budget-grid">
                            {listBudget.map(i => {
                                const isSelected = budgetSelected === i.value;
                                return (
                                    <div
                                        className={`budget-item ${isSelected ? 'selected' : ''}`}
                                        key={i.value}
                                        onClick={() => setBudgetSelected(i.value)}
                                    >
                                        <div className="budget-value">{i.label}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Button size="large" onClick={handleClose} style={{ borderRadius: '8px' }}>Hủy bỏ</Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}

export default ModalRecharge;
