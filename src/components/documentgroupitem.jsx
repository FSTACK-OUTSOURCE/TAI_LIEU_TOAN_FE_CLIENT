'use client'
import { List, Collapse, Image, Button } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import DocumentTopup from '@/components/documenttopup';
import DocumentPreview from '@/components/documentpreview';
import { useState } from 'react';
import { checkSignIn, downloadDocument } from '@/constants/client';
import { useAppContext } from "@/appcontext";
import './styles/documentGroupItem.css';

const DocumentGroupItem = ({ props }) => {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [showTopup, setShowTopup] = useState(false);
    const [childDocumentInfo, setChildDocumentInfo] = useState({})
    const { appcontext, setAppContext } = useAppContext();
    const { groups } = props;
    const checkDownloaded = (documentId) => {
        var downloaded = localStorage.getItem('downloaded');
        if (downloaded) {
            var downloadedArray = JSON.parse(downloaded);

            if (downloadedArray.includes(documentId)) {
                return true;
            }
        }
        return false;
    }
    const buyDocument = async (item) => {
        setChildDocumentInfo(item)
        if (!appcontext.username) {
            var response = await checkSignIn();
            if (response.success) {
                setAppContext({ ...appcontext, ...response.userinfo })
                window.location.reload();
            }
        }
        else {
            setShowTopup(true)
        }
    }
    const togglePopup = (item) => {
        setChildDocumentInfo(item)
        setShowPopup(!showPopup);
    };

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const getActions = (item) => {
        var result = []

        if (!item.IS_FOLDER && item.PRICE) {
            if (checkDownloaded(item.DOCUMENT_ID)) {
                result.push(<span>Đã tải</span>)
            }

            if (!item.BOUGHT) {
                result.push(<label className="font10pt fontBold fontBlack">Giá tiền: <span className="colorTaiLieu">{new Intl.NumberFormat('vi-VN').format(item.PRICE)}</span></label>)
                result.push(<Button style={{ marginLeft: 3, backgroundColor: 'green' }} type="primary" icon={<DownloadOutlined />} size={'small'} onClick={() => {
                    buyDocument(item)
                }}>
                    Tải về
                </Button>)
                if (item.LINK_PREVIEW) {
                    result.push(<Button style={{ marginLeft: 3, backgroundColor: '#fb6a00' }} type="primary" icon={<EyeOutlined />} size={'small'} onClick={() => { togglePopup(item) }}>
                        Xem thử
                    </Button>)
                }
                if (item.LINK_FULL) {
                    result.push(<Button style={{ marginLeft: 3 }} type="primary" icon={<EyeOutlined />} size={'small'} onClick={() => {
                        window.open(`${item.LINK_FULL}`)
                    }}>
                        Xem thử gói
                    </Button>)
                }
            }
            else {
                result.push(<Button style={{ marginLeft: 3, backgroundColor: '#5ab5ff' }} type="primary" icon={<DownloadOutlined />} size={'small'} onClick={() => {
                    downloadDocument(item)
                }}>
                    Đã mua
                </Button>)
            }


        }

        return result;
    }

    return (
        <section>
            <Collapse accordion style={{ background: '#4189f5'}}>
                {groups.map((group, index) => (
                    <Collapse.Panel  header={<span style={{ color: "white", fontWeight: "bold" }}>{group.GROUP_NAME}</span>} key={index} >
                        <List
                            dataSource={group.documents}
                            renderItem={(item) => {
                                return (
                                    <List.Item
                                        actions={getActions(item)}>
                                        <List.Item.Meta
                                            avatar={item.IS_FOLDER ? <Image
                                                preview={false}
                                                src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/folder.png"}
                                                alt="Ảnh bị ẩn do mạng"
                                                className='img-fluid'
                                                width={50}
                                                height={50}
                                            /> : <Image
                                                preview={false}
                                                src={item.ImageLink ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/docTaiLieu.png"}
                                                alt="Ảnh bị ẩn do mạng"
                                                className='img-fluid'
                                                width={50}
                                                height={50}
                                            />}
                                            title={
                                                <button style={{ border: 'none', background: 'none', textAlign: 'left' }} className="customLink font10pt" title={item.NAME} onClick={() => {
                                                    router.push(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
                                                }}>
                                                    <div dangerouslySetInnerHTML={{ __html: item.NAME }} />
                                                </button>
                                            }
                                        />
                                    </List.Item>
                                )
                            }
                            }
                        />
                    </Collapse.Panel>
                ))}

                {showPopup && <DocumentPreview props={{ documentinfo: childDocumentInfo, onClose: togglePopup }} />}
                {showTopup && <DocumentTopup props={{ onClose: toggleTopup, documentinfo: childDocumentInfo }} />}
            </Collapse>
        </section>

    );
}

export default DocumentGroupItem;