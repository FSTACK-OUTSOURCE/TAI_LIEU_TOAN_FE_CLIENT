'use client'
import { CloseOutlined } from '@ant-design/icons';
import { useState } from "react";
import { Image, Button, Card } from 'antd';
import { getConfig } from "@/constants/server";
import { useAppContext } from "@/appcontext";


const DocumentAdvise = ({ props }) => {
    const { documentinfo, onClose } = props
    const { appcontext } = useAppContext();
    const [textCopy, setTextCopy] = useState('Sao chép đường link')

    const redirectLink = (link) => {
        window.open(link, '_blank').focus();
    }
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setTextCopy('Đã sao chép')
        } catch (err) {
        }
    };
    return (
        <div className="overlay">
            <div className="popupTopup">
                <div className="boxSideChiTiet">
                    <Card title="TƯ VẤN NHANH TÀI LIỆU" extra={<button style={{ border: 'none', background: 'none' }} onClick={() => { onClose() }}><CloseOutlined /></button>} >
                        <div className="row form-group">
                            <div className="col-md-1">{documentinfo?.IS_FOLDER ? <Image
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
                                    <div className="cold-md-12">{documentinfo?.NAME}</div>
                                    <div className="col-md-12">Giá tiền: <span className="colorTaiLieu">{new Intl.NumberFormat('vi-VN').format(documentinfo?.PRICE)}</span></div>
                                </div>

                            </div>
                        </div>
                        <div className="row form-group mt-5">
                            <div className="section-heading mt-3 pt-3 pb-3 mb-3 filterListFile">
                                <span>
                                    Tôi muốn đăng ký tài liệu này. Vui lòng tư vấn, hướng dẫn
                                </span>
                                <br />
                                <span>
                                    {window.location.href}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-3 row">
                            <Button style={{ marginLeft: 5, backgroundColor: '#0d6efd' }} type="primary" size={'middle'} onClick={async () => {
                                await copyToClipboard(window.location.href);
                            }}>{textCopy}</Button>
                        </div>

                        <div className="col-md-12 mt-5">
                            Sao chép nội dung trên rồi gửi vào Zalo của website <button style={{ background: 'none', border: 'none' }} onClick={() => {
                                redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                            }} target="_blank"><Image preview={false} src="/zaloimg.png" alt="Tài liệu toán.vn" width={200} height={50} /></button>
                        </div>


                    </Card>
                </div>
            </div>
        </div>

    );
}

export default DocumentAdvise;