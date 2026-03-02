"use client"
import React from "react";
import { Image } from 'antd';
import { getConfig } from "@/constants/server";
import Balance from "./balance";
import { useAppContext } from "@/appcontext";

const Right = () => {

    const { appcontext, setAppContext } = useAppContext();

    const redirectLink = (link) => {
        window.open(link, '_blank').focus();
    }
    const phoneNumber = getConfig({ configs: appcontext.configs, name: 'hotline' })
    return (
        <div className="col-lg-3 col-xl-3">
            <Balance />
            <div className="card mt-3">
                <p className="titleHuongDan">
                    Hướng dẫn - Hỗ trợ
                </p>
                <div className="card-body font14">
                    <div>
                        <div className="text-board font14">
                            <p ><span className="centerContent"><strong>Hỗ trợ qua Zalo 24/24</strong></span></p>

                            <Image preview={false} src="/zaloimg.png" alt="Ảnh bị ẩn do mạng" width={260} height={80} onClick={() => {
                                redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                            }} style={{ cursor: 'pointer' }} />

                            <Image src="/kythuatimg.png" preview={false} alt="Ảnh bị ẩn do mạng" width={260} height={80} onClick={() => {
                                redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                            }} style={{ marginTop: 10, cursor: 'pointer' }} />

                            <hr></hr>
                            <Image preview={false} src="/huongdanimg.png" alt="Ảnh bị ẩn do mạng" onClick={() => {
                                redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                            }} width={270} height={100} style={{ cursor: 'pointer' }} />

                            <Image preview={false} src="/hdnaptienimg.png" alt="Ảnh bị ẩn do mạng" onClick={() => {
                                redirectLink(getConfig({ configs: appcontext.configs, name: 'zalo' }))
                            }} width={270} height={100} style={{ cursor: 'pointer' }} />

                            <hr></hr>
                            <p><img alt="?" src="https://static.xx.fbcdn.net/images/emoji.php/v9/tbf/1.5/32/1f4cc.png" width={18} height={18} />  <span className="font14" >Tài liệu dành cho giáo viên các cấp, gia sư, bản word, PPT có thể chỉnh sửa.</span></p>

                            <p><img alt="?" src="https://static.xx.fbcdn.net/images/emoji.php/v9/tbf/1.5/32/1f4cc.png" width={18} height={18} />  <span className="font14" >Tải dễ dàng, lưu trữ vĩnh viễn trên website. Quản lý tài liệu khoa học, trực quan.</span></p>

                            <p><img alt="?" src="https://static.xx.fbcdn.net/images/emoji.php/v9/tbf/1.5/32/1f4cc.png" width={18} height={18} />  <span className="font14" >Dịch vụ uy tín - Tài liệu chất lượng. Bảo hành tài liệu vĩnh viễn.</span></p>

                            <p><img alt="?" src="https://static.xx.fbcdn.net/images/emoji.php/v9/tbf/1.5/32/1f4cc.png" width={18} height={18} />  <span className="font14" >Đội ngũ hỗ trợ 24/7.</span></p>

                            <p>
                                <img alt="?" src="https://static.xx.fbcdn.net/images/emoji.php/v9/tbf/1.5/32/1f4cc.png" width={18} height={18} />  <span className="font14" >Hotline: </span>


                                <strong>
                                    <a href={`tel:${getConfig({ configs: appcontext.configs, name: 'hotline' })}`} style={{textDecoration: 'none'}}>
                                        <span className="font14" >{
                                            phoneNumber ? `${phoneNumber.slice(0, 4)}.${phoneNumber.slice(4, 7)}.${phoneNumber.slice(7)}` : ''
                                        }</span>
                                    </a>
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Right;