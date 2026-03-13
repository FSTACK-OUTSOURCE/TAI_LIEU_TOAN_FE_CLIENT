'use client'
import { DownloadOutlined, FilePdfOutlined, PhoneOutlined } from '@ant-design/icons';
import './styles/documentDetail.css'
import { useState } from 'react';
import { useAppContext } from '@/appcontext';
import { checkSignIn, downloadDocument } from '@/constants/client';
import DocumentTopup from './documenttopup';
import { Divider, Image } from 'antd';

const DocumentDetail = ({documentinfo}) =>{
const { appcontext } = useAppContext();
    const [showTopup, setShowTopup] = useState(false);

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const buyDocument = async () => {
            if (!appcontext.username) {
                await checkSignIn();
            }
            else {
                setShowTopup(true)
            }
    }


    return (
        <div 
            className="row" 
            style={{backgroundColor:"#ffffff", padding:"30px", borderRadius:"2px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}
            >
            <div className="col-md-5 col-lg-5 col-xl-5">
                <Image
                        preview={false}
                        src={documentinfo.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${documentinfo.IMAGE_LINK}` : "/folder.png"}
                        alt="Tài liệu toán.vn"
                        className='img-fluid'
                        width={122}
                        height={122}
                    />
            </div>
            <div className="col-md-7 col-lg-7 col-xl-7">
                
                {/* name */}
                <div className='form-name' dangerouslySetInnerHTML={{ __html: documentinfo?.NAME || '' }} />
                
                {/* info download */}
                <div className="form-info-download">
                    <div className='info-download-item'>
                        <DownloadOutlined style={{color:"#5c6c75"}}/>
                        <span>{888} Lượt tải</span>
                    </div>
                </div>
                
                {/* price */}
                {documentinfo?.PRICE ? <div className='form-price'>
                    <p>{new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE)} đ</p>
                </div> : null}
                
                {/*  info */}
                <div className="detail-info row" >
                    <div className="col-lg-6">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="100">Lớp:</td>
                                    <td><strong>Lớp 10</strong></td>
                                </tr>
                                <tr>
                                    <td>Môn:</td>
                                    <td><strong>Hóa Học</strong></td>
                                </tr>
                                <tr>
                                    <td>Bộ sách:</td>
                                    <td><strong>Kết nối tri thức</strong></td>
                                </tr>
                                <tr>
                                    <td>Dạng:</td>
                                    <td><strong>Giáo án</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-6">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="100">File:</td>
                                    <td className="js-file_type">
                                        <img className="img-fluid" src="https://tailieugiaovien.com.vn/assets/images/doc.png" alt="Word" width="40"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Loại:</td>
                                    <td>
                                        <strong>Tài liệu lẻ</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Số trang:</td>
                                    <td>
                                        <strong>17 trang</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/*  Action */}
                <div className="form-action">
                    {!documentinfo.BOUGHT && documentinfo.LINK_FULL
                        ?   <button  type="button" className="btn btn-dark rounded-0 me-2 mb-2 mt-2 js-preView" onClick={() => {
                                    if (documentinfo.LINK_FULL) {
                                        window.open(`${documentinfo.LINK_FULL}`)
                                    }
                                }}>
                                    <FilePdfOutlined style={{marginRight:"10px"}}/> XEM THỬ
                    </button> : null}
                    
                    <button
                        className="btn btn-success rounded-0 mb-2 mt-2" type="button" data-bs-toggle="modal" data-bs-target="#buyDocumentModal"
                        onClick={()=>documentinfo?.BOUGHT ? downloadDocument(documentinfo) : buyDocument()}
                    >
                        {documentinfo?.BOUGHT ?<><DownloadOutlined style={{marginRight:"10px"}}/> TẢI LẠI</> : <><DownloadOutlined style={{marginRight:"10px"}}/> TẢI XUỐNG</>}
                    </button>
                </div>
                <Divider/>

                {/* buy step */}
                <div class="alert alert-info rounded-0" role="alert">
                    MUA NGAY ĐỂ XEM TOÀN BỘ TÀI LIỆU
                </div>
                <div class="order-step">
                    <h6 style={{
                        color:"#008000"
                    }}>CÁCH MUA:</h6>
                    <ul className="ps-4">
                        <li><strong>B1:</strong> Gửi phí vào TK: <code class="fs-5">109004822580</code> - NGUYỄN THỊ LONG - Ngân hàng VietinBank<a href="#" target="_blank"> (QR)</a></li>
                        <li><strong>B2:</strong> Nhắn tin tới Zalo <a href="https://zalo.me/3800062780558660756" target="_blank">tailieutoan.vn <span>( nhấn vào đây )</span></a> để xác nhận thanh toán và tải tài liệu - giáo án</li>
                    </ul>
                    <p className="mt-2 ms-3"
                        style={{
                        fontSize:"16px"
                    }}>
                        <a className="btn btn-info btn-sm rounded-0"
                            style={{
                                color:"#fff",
                                fontSize:"16px",
                                padding:"3px 7px"
                            }}
                            href="https://zalo.me/3800062780558660756" // TODO
                            target="_blank"
                        >
                            Tư vấn nhanh
                        </a>
                        <PhoneOutlined style={{ margin:"0 8px" }}/>
                        <span className="d-none d-md-inline">Hotline hỗ trợ:</span>
                        <span className="fs-5" style={{color:"#FF5722"}}> 0386.117.490 </span>
                    </p>
                </div>
                <Divider/>

                {/* description */}
                <div >
                    <div dangerouslySetInnerHTML={{ __html: documentinfo.DESCRIPTION }} />
                </div>

            </div>
            {/* MOdal */}
            {showTopup && <DocumentTopup props={{ onClose: toggleTopup, documentinfo }} />}
        </div>
    )
}

export default DocumentDetail