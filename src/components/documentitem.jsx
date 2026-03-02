'use client'
import { useRouter } from 'next/navigation'
import { useAppContext } from "@/appcontext";
import { List, Checkbox, Row, Col, Image, Button } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { checkSignIn, downloadDocument } from '@/constants/client';
import DocumentTopup from '@/components/documenttopup';
import DocumentPreview from '@/components/documentpreview';


const DocumentItem = ({ props }) => {
    const { documentinfo, topics } = props
    const [childDocuments, setChildDocuments] = useState([])
    const [childDocumentInfo, setChildDocumentInfo] = useState({})
    const [topicIds, setTopicIds] = useState([])
    const [showTopup, setShowTopup] = useState(false);
    const { appcontext, setAppContext } = useAppContext();
    const router = useRouter();


    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };


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

    const filterTopic = (values) => {
        setTopicIds(values)
    }

    useEffect(() => {
        if (documentinfo.childDocuments.length > 0) {
            setChildDocuments(documentinfo.childDocuments.filter(x => x.IS_FOLDER))
        }
    }, [documentinfo]);

    return (

        <section>
            {
                documentinfo.IS_FOLDER ?
                    <div className="form-group row">
                        <div className="col-md-12">
                            {documentinfo.PRICE || !documentinfo.childDocuments.some((x) => !x.IS_FOLDER) || topics.length == 0 ? <div></div> :
                                <div className="card">
                                    <div className="card-header">
                                        <span className="text-danger fontBold" style={{ fontSize: "1.3rem" }}>LỌC CHỦ ĐỀ</span> <span>(có thể chọn nhiều chủ đề)</span>
                                    </div>
                                    <div className="card-body">
                                        <Checkbox.Group style={{ width: '100%' }} onChange={(values) => { filterTopic(values) }}>
                                            <Row>
                                                {
                                                    topics.map((element) =>
                                                        <Col span={8} className="p-1" >
                                                            <Checkbox value={element.TOPIC_ID}>{element.NAME}</Checkbox>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        </Checkbox.Group>

                                    </div>
                                    <div className="card-footer">
                                        <button type="button" className="btn btn-primary" onClick={() => {
                                            var childDocuments = topicIds.length == 0 ? documentinfo.childDocuments : documentinfo.childDocuments.filter(x => topicIds.includes(x.TOPIC_IDS))
                                            setChildDocuments(childDocuments)
                                        }
                                        }>Lọc</button>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            childDocuments.length > 0 ?
                                <div className="table-responsive">
                                    <div className="table table-bordered table-topic">
                                        <List
                                            pagination={{
                                                pageSize: 10,
                                                locale: { items_per_page: "tài liệu / trang" }
                                            }}
                                            grid={!childDocuments.some((x) => x.PRICE) ? { gutter: 16, column: 2 } : undefined}
                                            dataSource={childDocuments}
                                            renderItem={(item) => {
                                                return (
                                                    <List.Item
                                                        className='filterListFile'
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
                                                                src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/docTaiLieu.png"}
                                                                alt="Ảnh bị ẩn do mạng"
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
                    </div>
                    :
                    <div className={`text-center`}>
                        <iframe src={documentinfo.LINK_PREVIEW} width="800" height="750"></iframe>
                    </div>
            }
            {showTopup && <DocumentTopup props={{ onClose: toggleTopup, documentinfo: childDocumentInfo }} />}
        </section>


    );
}

export default DocumentItem;