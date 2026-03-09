'use client'

import MainTempalte from './mainTempalte';
import { List, Image, Button } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { checkSignIn, downloadDocument } from '@/constants/client';
import { useAppContext } from '@/appcontext';
import { useState } from 'react';
import DocumentTopup from './documenttopup';

const DocumentSearch = ({ documents }) => {
    const { appcontext, setAppContext } = useAppContext();
    const [childDocumentInfo, setChildDocumentInfo] = useState({})
    const [showTopup, setShowTopup] = useState(false);

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
    const getActions = (item) => {
        var result = []

        if (item.PRICE) {
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
        <MainTempalte>
            <section>
                {
                    documents.length > 0 ?
                        <div className="table-responsive">
                            <div className="table table-bordered table-topic">
                                <List
                                    pagination={{
                                        pageSize: 10,
                                        locale: { items_per_page: "tài liệu / trang" }
                                    }}
                                    grid={!documents.some((x) => x.PRICE) ? { gutter: 16, column: 2 } : undefined}
                                    dataSource={documents}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item
                                                className='filterListFile'
                                                actions={getActions(item)}>
                                                <List.Item.Meta
                                                    avatar={item.IS_FOLDER ? <Image
                                                        preview={false}
                                                        src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/folder.png"}
                                                        alt="Tài liệu toán.vn"
                                                        className='img-fluid'
                                                        width={50}
                                                        height={50}
                                                    /> : <Image
                                                        preview={false}
                                                        src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/docTaiLieu.png"}
                                                        alt="Tài liệu toán.vn"
                                                        className='img-fluid'
                                                        width={50}
                                                        height={50}
                                                    />}
                                                    title={
                                                        <button style={{ border: 'none', background: 'none', textAlign: 'left' }} className="customLink font10pt" title={item.NAME} onClick={() => {
                                                            if (item.PRICE) {
                                                                window.open(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, "_blank");
                                                            }
                                                            else {
                                                                router.push(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
                                                            }
                                                        }}>
                                                            <div dangerouslySetInnerHTML={{ __html: item.NAME }} />
                                                        </button>
                                                    }
                                                />
                                            </List.Item>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        : <></>
                }

                {/*  */}
                {showTopup && <DocumentTopup props={{ onClose: toggleTopup, documentinfo: childDocumentInfo }} />}
            </section>
        </MainTempalte>
    )
}

export default DocumentSearch;