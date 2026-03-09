"use client"
import React from "react";
import { useAppContext } from "@/appcontext";
import { Card, Image } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { getConfig } from "@/constants/server";
import { downloadDocument } from "@/constants/client";
import Swal from "sweetalert2";

const DocumentTopup = ({ props }) => {
    const { documentinfo, onClose } = props
    const { appcontext } = useAppContext();
    const redirectLink = (link) => {
        window.open(link, '_blank').focus();
    }
    const buyDocument = async () => {
        if (appcontext.balance < documentinfo.PRICE) {
            var message = `<a href="tel: ${phoneNumber}">
            <span className="font14"> ${phoneNumber.slice(0, 4)}.${phoneNumber.slice(4, 7)}.${phoneNumber.slice(7)}</span>
            </a>`
            Swal.fire({
                title: 'Thông báo',
                html: `Số dư tài khoản không đủ. <br/> Vui lòng liên hệ hotline: <br/> ${message} <br/>để được tư vấn và hỗ trợ`,
                icon: 'warning'
            });
            return;
        }
        else {
            await downloadDocument(documentinfo, onClose)
        }
    }
    const phoneNumber = getConfig({ configs: appcontext.configs, name: 'hotline' })
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
                        <div className="row form-group mt-5">
                            <div className="gap-5 flexAlignStart">
                                <div className="paymentQR w-50 d-flex flex-column justify-content-start align-items-center roundedMd" style={{ height: '100%' }} onClick={() => {
                                    buyDocument();
                                }}>
                                    <div className="mt-2">
                                        <img src="/coin.png" alt="so-du" width={80} height={80} />
                                    </div>
                                    <div className="mt-3 payment-method-desc">
                                        <p>Sử dụng số dư tài khoản để tải tài liệu</p>
                                        <p><i className="bi-cash-coin"></i> Số dư hiện tại: <span className="fw-bold text-danger">{new Intl.NumberFormat('vi-VN').format(appcontext.balance)} đ</span></p>

                                        {
                                            appcontext.balance < documentinfo.PRICE ? <div className="border-top">
                                                <span className="fs-13 text-red me-2">Số dư không đủ vui lòng liên hệ Zalo</span>
                                                <Image preview={false} src="/zaloimg.png" alt="Tài liệu toán.vn" width={200} height={50} onClick={
                                                    () => { redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' })) }
                                                } />
                                            </div> : <p className="text-center">Hoặc chuyển khoản nhanh bằng hình thức quét mã QR ngân hàng</p>
                                        }
                                    </div>
                                </div>
                                <div className="paymentQR roundedMd w-50 d-flex flex-column justify-content-start align-items-center" style={{ height: '100%' }} onClick={
                                    () => {
                                        redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                                    }
                                }>
                                    <div className="mt-2">
                                        <img src="/qrcode.png" alt="icon" width={250} height={250} />
                                    </div>
                                    <div className="mt-3 payment-method-desc" data-key="18870" data-user-id="70037" data-action="quick-download-qr">
                                        <p>CHUYỂN KHOẢN : {new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE)} VÀO TÀI KHOẢN</p>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div> Tên tài khoản: NGUYỄN THỊ LONG</div>
                                            <div>SỐ TK: 109004822580</div>
                                            <div>Ngân hàng: VietinBank</div>
                                            <div>Số Tiền: {new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE)}</div>
                                            <div>Nội dung chuyển khoản: MUA TÀI LIỆU</div>
                                        </div>
                                        <p></p>
                                        (CK XONG THẦY CÔ GỬI ẢNH VÀO ZALO: <a href="#" onClick={
                                            () => { redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' })) }
                                        } >0386.117.490</a>)
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DocumentTopup;