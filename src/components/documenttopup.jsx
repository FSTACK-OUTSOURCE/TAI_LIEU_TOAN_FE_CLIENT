"use client"
import React, { useState } from "react";
import { useAppContext } from "@/appcontext";
import { Card, Image } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getConfig } from "@/constants/server";
import { downloadDocument } from "@/constants/client";
import Swal from "sweetalert2";
import {
    AdminPhoneNumber,
    VIETQR_BANK_NAME,
    VIETQR_ACCOUNT_NAME,
    VIETQR_ACCOUNT_NO,
    getVietQRUrl,
} from "@/constants/dataCommon";

const DocumentTopup = ({ props }) => {
    const { documentinfo, onClose, onOpenRecharge } = props;
    const { appcontext } = useAppContext();
    const [mode, setMode] = useState('choice');
    const balance = Number(appcontext.balance) || 0;
    const formattedBalance = new Intl.NumberFormat('vi-VN').format(balance);
    const phoneNumber = getConfig({ configs: appcontext.configs, name: 'hotline' });
    const redirectLink = (link) => {
        if (!link) return;
        window.open(link, '_blank')?.focus();
    };
    const buyDocument = async () => {
        if (appcontext.balance < documentinfo.PRICE) {
            const message = `<a href="tel:${phoneNumber}"><span class=\"font14\"> ${phoneNumber.slice(0, 4)}.${phoneNumber.slice(4, 7)}.${phoneNumber.slice(7)}</span></a>`;
            Swal.fire({
                title: 'Thông báo',
                html: `Số dư tài khoản không đủ. <br/> Vui lòng liên hệ hotline: <br/> ${message} <br/>để được tư vấn và hỗ trợ`,
                icon: 'warning',
            });
            return;
        }
        await downloadDocument(documentinfo, onClose);
    };
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE);
    return (
        <div className="overlay">
            <div className="popupTopup">
                <div className="boxSideChiTiet">
                    <Card title="Xác nhận mua tài liệu" extra={<button style={{ border: 'none', background: 'none' }} onClick={() => { onClose() }}><CloseOutlined /></button>} >
                        <div className="row form-group">
                            <div className="col-md-1">{documentinfo.IS_FOLDER ? <Image
                                src="/folder.png"
                                alt="Tài liệu toán.vn"
                                className='img-fluid'
                                width={50}
                                height={50}
                            /> : <Image
                                src="/docTaiLieu.png"
                                alt="Tài liệu toán.vn"
                                className='img-fluid'
                                width={50}
                                height={50}
                            />}</div>
                            <div className="col-md-11">
                                <div className="row form-group" style={{ fontWeight: "bold" }}>
                                    <div className="cold-md-12">{documentinfo.NAME}</div>
                                    <div className="col-md-12">Giá tiền: <span className="colorTaiLieu">{new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE)}</span></div>
                                </div>

                            </div>
                        </div>
                        {mode === 'choice' ? (
                            <div className="row form-group mt-5">
                                <div className="gap-5 flexAlignStart">
                                    <div
                                        className="paymentQR w-50 d-flex flex-column justify-content-start align-items-center roundedMd"
                                        style={{ height: '100%', cursor: 'default', background: '#fff8ec', border: '1px solid #f0d8b5' }}
                                    >
                                        <div className="mt-2">
                                            <img src="/coin.png" alt="so-du" width={80} height={80} />
                                        </div>
                                        <div className="mt-3 payment-method-desc text-center" style={{ width: '100%' }}>
                                            <p style={{ fontWeight: 700, fontSize: 16 }}>Sử dụng số dư tài khoản để tải tài liệu</p>
                                            <p style={{ marginBottom: 4, color: '#555' }}>
                                                <span style={{ marginRight: 6 }}>
                                                    <i className="bi bi-wallet2" />
                                                </span>
                                                Số dư hiện tại: <span className="fw-bold text-danger">{formattedBalance} đ</span>
                                            </p>
                                            {balance < documentinfo.PRICE ? (
                                                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ color: '#d32f2f', fontWeight: 600 }}>Số dư không đủ vui lòng</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning"
                                                        style={{ minWidth: 120, padding: '8px 18px', fontWeight: 700 }}
                                                        onClick={() => {
                                                            onClose();
                                                            onOpenRecharge?.();
                                                        }}
                                                    >
                                                        Nạp tiền
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ marginTop: 12 }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        style={{ minWidth: 140, padding: '8px 18px', fontWeight: 700 }}
                                                        onClick={buyDocument}
                                                    >
                                                        Tải tài liệu
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="paymentQR roundedMd w-50 d-flex flex-column justify-content-start align-items-center"
                                        style={{ height: '100%', cursor: 'pointer', border: '1px solid #eee' }}
                                        onClick={() => setMode('qr')}
                                    >
                                        <div className="mt-2">
                                            <img src="/anh-viet-qr.png" alt="Mua nhanh QR" width={220} style={{ maxWidth: '100%' }} />
                                        </div>
                                        <div className="mt-3 payment-method-desc text-center">
                                            <p style={{ fontWeight: 700 }}>Mua nhanh gói tài liệu bằng hình thức quét mã QR ngân hàng</p>
                                            <p style={{ color: '#777' }}>
                                                (Sử dụng ứng dụng ngân hàng bất kỳ để quét mã QR thanh toán tài liệu tự động. Nhanh chóng & đơn giản)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row form-group mt-5">
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: 320 }}>
                                        <h6 style={{ marginBottom: 16, fontWeight: 700, color: '#222' }}>
                                            Thanh toán {formattedPrice}đ để tải gói tài liệu
                                        </h6>
                                        <div style={{ background: '#fde9d6', padding: 14, borderRadius: 10, marginBottom: 12 }}>
                                            Dùng phần quét mã QR trong ứng dụng ngân hàng hoặc Momo để quét mã sau
                                        </div>
                                        <table className="table table-borderless mb-0" style={{ fontSize: 14, color: '#333', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: 140, fontWeight: 700, background: '#fafafa', padding: '12px 16px' }}>Tên tài khoản:</td>
                                                    <td style={{ padding: '12px 16px' }}>{VIETQR_ACCOUNT_NAME}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontWeight: 700, background: '#fafafa', padding: '12px 16px' }}>Số tài khoản:</td>
                                                    <td style={{ padding: '12px 16px' }}>{VIETQR_ACCOUNT_NO}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontWeight: 700, background: '#fafafa', padding: '12px 16px' }}>Ngân hàng:</td>
                                                    <td style={{ padding: '12px 16px' }}>{VIETQR_BANK_NAME}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontWeight: 700, background: '#fafafa', padding: '12px 16px' }}>Số tiền:</td>
                                                    <td style={{ padding: '12px 16px' }}>{formattedPrice}đ</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 320, border: '1px solid #4caf50', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '100%', borderBottom: '1px solid #eee', paddingBottom: 12, marginBottom: 12, textAlign: 'center' }}>
                                            <strong>Hướng dẫn quét mã QR</strong>
                                        </div>
                                        <img src={getVietQRUrl(documentinfo.PRICE, 'MUA TAI LIEU')} alt="QR" style={{ width: '100%', maxWidth: 320, borderRadius: 8 }} />
                                        <p style={{ marginTop: 14, textAlign: 'center', color: '#555', fontSize: 13 }}>
                                            Vui lòng giữ nguyên cửa sổ này và chờ 2-3 giây sau khi quét mã xong để giao dịch hoàn tất tự động
                                        </p>
                                    </div>
                                </div>
                                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setMode('choice')}>
                                        Quay lại
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))}>
                                        HỖ TRỢ KỸ THUẬT
                                    </button>
                                </div>
                            </div>
                        )}

                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DocumentTopup;