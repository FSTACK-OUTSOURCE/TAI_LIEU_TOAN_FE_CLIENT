'use client'
import { useAppContext } from "@/appcontext";
import { Button, Image } from 'antd';
import { DownloadOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { checkSignIn, handleBadRequest, downloadFile, downloadDocument } from '@/constants/client';
import { useState } from "react";
import Swal from 'sweetalert2';
import DocumentTopup from "@/components/documenttopup";
import DocumentAdvise from "@/components/documentadvise";


const DocumentAction = ({ props }) => {
    const { documentinfo } = props;
    const { appcontext, setAppContext } = useAppContext();
    const [showTopup, setShowTopup] = useState(false);
    const [showAdvise, setShowAdvise] = useState(false);


    const downloadPdf = async () => {
        if (!appcontext.username) {
            var response = await checkSignIn();
            if (response.success) {
                setAppContext({ ...appcontext, ...response.userinfo })
                window.location.reload();
            }
        }
        else {
            try {
                var fileUrl = `/api/file?documentid=${documentinfo.DocumentId}`;
                await downloadFile(fileUrl, `${documentinfo.Name}${documentinfo.PdfExtension}`)
                Swal.close();
            } catch (error) {
                await handleBadRequest(error)

            }
        }
    }

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const toggleAdvise = () => {
        setShowAdvise(!showAdvise);
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
        <div className="titleDocumentPage row form-group">
            {
                documentinfo.IS_FOLDER && documentinfo.PRICE ? <div className="col-md-2">
                    <Image
                        preview={false}
                        src={documentinfo.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${documentinfo.IMAGE_LINK}` : "/folder.png"}
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        width={122}
                        height={122}
                    />
                </div> : <></>
            }
            <div className="col-md-10 titleColor">
                <div dangerouslySetInnerHTML={{ __html: documentinfo.NAME }} />
                {
                    documentinfo.IS_PUBLIC && documentinfo.IS_FOLDER ? <div className="col-md-12">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="flickerCircle"></div>
                            <span style={{ color: 'green', fontSize: '13pt', marginLeft: '10px' }}>Tài liệu vẫn đang tiếp tục được cập nhật...</span>
                        </div>
                    </div> : <></>
                }
                {appcontext.username == "thayluanvatly@gmail.com" ? <Button style={{ marginLeft: 3, backgroundColor: 'red' }} type="primary" size={'middle'} onClick={() => {
                    window.open(`https://quantri.tailieutoan.vn/Admin/Document?parentDocumentId=${documentinfo.PARENT_DOCUMENT_ID}&IDENTITY_KEY=${documentinfo.IDENTITY_KEY}`)
                }}>Sửa</Button> : <></>}
                {documentinfo.PRICE ? <>
                    <div className={`col-md-12`}>
                        {
                            documentinfo.BOUGHT ? <></> : <label className="font10pt fontBold fontBlack">Giá tiền: <span className="colorTaiLieu">{new Intl.NumberFormat('vi-VN').format(documentinfo.PRICE)}</span></label>
                        }
                    </div>
                    <div className="col-md-12">
                        {
                            documentinfo.PdfKey ? <Button style={{ marginLeft: 3, backgroundColor: 'red' }} type="primary" icon={<DownloadOutlined />} size={'middle'} onClick={() => {
                                downloadPdf()
                            }}>
                                Tải PDF
                            </Button> : <></>
                        }
                        {
                            documentinfo.BOUGHT ? documentinfo.IS_FOLDER ? <Button style={{ marginLeft: 3, backgroundColor: '#5ab5ff' }} type="primary" size={'middle'} >
                                Đã mua gói này
                            </Button> : <Button style={{ marginLeft: 3, backgroundColor: '#5ab5ff' }} type="primary" icon={<DownloadOutlined />} size={'middle'} onClick={() => {
                                downloadDocument(documentinfo)
                            }}>
                                Đã mua
                            </Button> : <Button style={{ marginLeft: 3, backgroundColor: 'green' }} type="primary" icon={<DownloadOutlined />} size={'middle'} onClick={() => {
                                buyDocument()
                            }}>
                                {documentinfo.IS_FOLDER ? "Đặt mua gói" : "Tải về"}
                            </Button>
                        }
                        {
                            documentinfo.BOUGHT ? <></> : !documentinfo.IS_FOLDER && documentinfo.LINK_FULL ?
                                <Button style={{ marginLeft: 5, backgroundColor: '#fb6a00' }} type="primary" icon={<EyeOutlined />} size={'middle'} onClick={() => {
                                    if (documentinfo.LINK_FULL) {
                                        window.open(`${documentinfo.LINK_FULL}`)
                                    }
                                }}>
                                    Xem thử gói
                                </Button> :
                                documentinfo.IS_FOLDER && documentinfo.LINK_FULL ? <Button style={{ marginLeft: 5, backgroundColor: '#fb6a00' }} type="primary" icon={<EyeOutlined />} size={'middle'} onClick={() => {
                                    if (documentinfo.LINK_FULL) {
                                        window.open(`${documentinfo.LINK_FULL}`)
                                    }
                                }}>
                                    Xem trọn bộ
                                </Button> : <></>
                        }
                        {
                            documentinfo.BOUGHT ? <></> : <Button style={{ marginLeft: 5, backgroundColor: '#0d6efd' }} type="primary" icon={<InfoCircleOutlined />} size={'middle'} onClick={() => {
                                setShowAdvise(true)
                            }}>Tư vấn nhanh</Button>
                        }
                    </div></> : <></>}
            </div>
            {showAdvise && <DocumentAdvise props={{ onClose: toggleAdvise, documentinfo }} />}
            {showTopup && <DocumentTopup props={{ onClose: toggleTopup, documentinfo }} />}
        </div>

    );
}

export default DocumentAction;