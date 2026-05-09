"use client";
import { useAppContext } from "@/appcontext";
import DocumentTopup from "@/components/documenttopup";
import { checkSignIn, downloadDocument } from "@/constants/client";
import {
    DownloadOutlined,
    EyeOutlined,
    SortAscendingOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Image, List, Row, Select } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SORT_OPTIONS = [
    { label: "Mặc định", value: "default" },
    { label: "Mới nhất", value: "date_desc" },
    { label: "Cũ nhất", value: "date_asc" },
];

const DocumentItem = ({ props }) => {
    const { documentinfo, topics, isShowDetail, isBundle, parentDocument } =
        props;
    const [displayDocuments, setDisplayDocuments] = useState([]);
    const [childDocumentInfo, setChildDocumentInfo] = useState({});
    const [selectedTopicIds, setSelectedTopicIds] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [showTopup, setShowTopup] = useState(false);
    const { appcontext, setAppContext } = useAppContext();
    const router = useRouter();

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const buyDocument = async (item) => {
        setChildDocumentInfo(item);
        if (!appcontext.username) {
            var response = await checkSignIn();
            if (response.success) {
                setAppContext({ ...appcontext, ...response.userinfo });
                window.location.reload();
            }
        } else {
            setShowTopup(true);
        }
    };

    const checkDownloaded = (documentId) => {
        var downloaded = localStorage.getItem("downloaded");
        if (downloaded) {
            var downloadedArray = JSON.parse(downloaded);
            if (downloadedArray.includes(documentId)) {
                return true;
            }
        }
        return false;
    };

    const getActions = (item) => {
        var result = [];

        if (item.PRICE) {
            if (checkDownloaded(item.DOCUMENT_ID)) {
                result.push(
                    <span
                        key="downloaded"
                        className="docit-badge docit-badge--success"
                    >
                        ✓ Đã tải
                    </span>,
                );
            }

            if (!item.BOUGHT) {
                result.push(
                    <span key="price" className="docit-price">
                        {new Intl.NumberFormat("vi-VN").format(item.PRICE)}đ
                    </span>,
                );
                result.push(
                    <Button
                        key="buy"
                        className="docit-btn docit-btn--primary"
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => buyDocument(item)}
                    >
                        Tải về
                    </Button>,
                );
                if (item.LINK_FULL) {
                    result.push(
                        <Button
                            key="preview"
                            className="docit-btn"
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => window.open(`${item.LINK_FULL}`)}
                        >
                            Xem thử
                        </Button>,
                    );
                }
            } else {
                result.push(
                    <Button
                        key="redownload"
                        className="docit-btn docit-btn--blue"
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => downloadDocument(item)}
                    >
                        Tải lại
                    </Button>,
                );
            }
        }

        return result;
    };

    const getFirstTopicName = useCallback(
        (doc) => {
            if (!doc.TOPIC_IDS) return "";
            const firstId = doc.TOPIC_IDS.split(",")[0].trim();
            return topics.find((t) => t.TOPIC_ID === firstId)?.NAME || "";
        },
        [topics],
    );

    const applyFilterAndSort = useCallback(
        (docs, topicFilter, sort) => {
            let result = [...docs];

            if (topicFilter.length > 0) {
                result = result.filter((x) =>
                    topicFilter.some(
                        (tid) => x.TOPIC_IDS && x.TOPIC_IDS.includes(tid),
                    ),
                );
            }

            if (sort === "date_desc") {
                result.sort(
                    (a, b) =>
                        new Date(b.CREATED_DATE) - new Date(a.CREATED_DATE),
                );
            } else if (sort === "date_asc") {
                result.sort(
                    (a, b) =>
                        new Date(a.CREATED_DATE) - new Date(b.CREATED_DATE),
                );
            } else if (sort === "topic") {
                result.sort((a, b) =>
                    getFirstTopicName(a).localeCompare(
                        getFirstTopicName(b),
                        "vi",
                    ),
                );
            } else if (sort === "author") {
                result.sort((a, b) =>
                    (a.CREATED_USER || "").localeCompare(
                        b.CREATED_USER || "",
                        "vi",
                    ),
                );
            }

            return result;
        },
        [getFirstTopicName],
    );

    useEffect(() => {
        setDisplayDocuments(
            applyFilterAndSort(
                documentinfo.childDocuments,
                selectedTopicIds,
                sortBy,
            ),
        );
    }, [documentinfo, selectedTopicIds, sortBy, applyFilterAndSort]);

    const hasNonFolderDocs = documentinfo.childDocuments.some(
        (x) => !x.IS_FOLDER,
    );
    const showFilterCard =
        !documentinfo.PRICE && hasNonFolderDocs && topics.length > 0;

    const bannerStyle = {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "8px 12px",
        background: "#fff7e6",
        border: "1px solid #ffe7ba",
        borderLeft: "3px solid #fa8c16",
        borderRadius: 6,
        marginBottom: 10,
    };

    const renderBundleBanner = () => {
        if (!documentinfo?.PRICE) return null;
        if (isBundle) {
            const count = documentinfo.childDocuments.filter(
                (x) => !x.IS_FOLDER,
            ).length;
            return (
                <div style={bannerStyle}>
                    <span
                        style={{
                            fontSize: "0.92rem",
                            fontWeight: 600,
                            color: "#d46b08",
                        }}
                    >
                        Bộ tài liệu · {count} tài liệu lẻ
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#389e0d" }}>
                        tiết kiệm đến 50%
                    </span>
                </div>
            );
        }
        if (parentDocument?.NAME) {
            return (
                <div style={bannerStyle}>
                    <span style={{ fontSize: "0.78rem", color: "#8c8c8c" }}>
                        Thuộc bộ tài liệu:
                    </span>
                    <span
                        style={{
                            fontSize: "0.92rem",
                            fontWeight: 600,
                            color: "#d46b08",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: parentDocument.NAME,
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    const renderToolbar = () => (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
                padding: "8px 12px",
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                borderRadius: 6,
                marginBottom: 8,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SortAscendingOutlined
                    style={{ color: "#8c8c8c", fontSize: 14 }}
                />
                <span
                    style={{
                        fontSize: "0.82rem",
                        color: "#595959",
                        fontWeight: 500,
                    }}
                >
                    Sắp xếp
                </span>
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    options={SORT_OPTIONS}
                    style={{ width: 140 }}
                    size="small"
                />
            </div>
            {showFilterCard && selectedTopicIds.length > 0 && (
                <Button
                    type="link"
                    size="small"
                    onClick={() => setSelectedTopicIds([])}
                    style={{ padding: 0, fontSize: "0.82rem" }}
                >
                    Xóa lọc ({selectedTopicIds.length})
                </Button>
            )}
        </div>
    );

    const renderTopicFilter = () =>
        showFilterCard && (
            <div
                style={{
                    padding: "10px 12px",
                    background: "#fff",
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    marginBottom: 8,
                }}
            >
                <div
                    style={{
                        fontSize: "0.72rem",
                        color: "#8c8c8c",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontWeight: 600,
                    }}
                >
                    Lọc theo chủ đề
                </div>
                <Checkbox.Group
                    value={selectedTopicIds}
                    onChange={setSelectedTopicIds}
                    style={{ width: "100%" }}
                >
                    <Row gutter={[4, 4]}>
                        {topics.map((element) => (
                            <Col xs={12} sm={8} md={6} key={element.TOPIC_ID}>
                                <Checkbox value={element.TOPIC_ID}>
                                    {element.NAME}
                                </Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
            </div>
        );

    return (
        <section className="docit">
            {displayDocuments?.length > 0 ? (
                <>
                    {renderBundleBanner()}
                    {renderTopicFilter()}
                    {renderToolbar()}

                    {displayDocuments.every((x) => x.IS_FOLDER) ? (
                        <div className="docit-folder-grid">
                            {displayDocuments.map((item) => {
                                const url = `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`;
                                return (
                                    <button
                                        key={item.IDENTITY_KEY}
                                        type="button"
                                        className="docit-folder-card"
                                        title={item.NAME}
                                        onClick={() =>
                                            router.push(url, { scroll: false })
                                        }
                                    >
                                        <Image
                                            preview={false}
                                            src={
                                                item.IMAGE_LINK
                                                    ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}`
                                                    : "/folder.png"
                                            }
                                            alt="Thư mục"
                                            width={56}
                                            height={56}
                                        />
                                        <span
                                            className="docit-folder-card__name"
                                            dangerouslySetInnerHTML={{
                                                __html: item.NAME,
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <List
                            pagination={{
                                pageSize: 10,
                                size: "small",
                                locale: { items_per_page: "/ trang" },
                            }}
                            dataSource={displayDocuments}
                            renderItem={(item) => (
                                <List.Item
                                    className="docit-item"
                                    actions={getActions(item)}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="docit-item__avatar">
                                                <Image
                                                    preview={false}
                                                    src={
                                                        item.IMAGE_LINK
                                                            ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}`
                                                            : item.IS_FOLDER
                                                              ? "/folder.png"
                                                              : "/docTaiLieu.png"
                                                    }
                                                    alt="Tài liệu"
                                                    width={40}
                                                    height={40}
                                                />
                                            </div>
                                        }
                                        title={
                                            <button
                                                className="docit-item__title customLink"
                                                title={item.NAME}
                                                onClick={() => {
                                                    const url = `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`;
                                                    if (item.PRICE) {
                                                        window.open(
                                                            url,
                                                            "_blank",
                                                        );
                                                    } else {
                                                        router.push(url, {
                                                            scroll: false,
                                                        });
                                                    }
                                                }}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.NAME,
                                                    }}
                                                />
                                            </button>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <iframe
                        src={documentinfo.LINK_PREVIEW}
                        width="800"
                        height="750"
                    />
                </div>
            )}
            {showTopup && (
                <DocumentTopup
                    props={{
                        onClose: toggleTopup,
                        documentinfo: childDocumentInfo,
                    }}
                />
            )}

            <style jsx global>{`
                .docit .docit-item {
                    padding: 8px 12px !important;
                    margin-bottom: 4px;
                    background: #fff;
                    border: 1px solid #f0f0f0 !important;
                    border-radius: 6px;
                    transition:
                        border-color 0.15s,
                        background 0.15s;
                }
                .docit .docit-item:hover {
                    border-color: #d9d9d9 !important;
                    background: #fafafa;
                }
                .docit .docit-item__avatar {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    background: #fafafa;
                    overflow: hidden;
                }
                .docit .docit-item__title {
                    border: none;
                    background: none;
                    text-align: left;
                    padding: 0;
                    font-size: 0.9rem;
                    line-height: 1.35;
                    cursor: pointer;
                    word-break: break-word;
                }
                .docit .ant-list-item-meta-content {
                    min-width: 0;
                }
                .docit-folder-grid {
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fill,
                        minmax(160px, 1fr)
                    );
                    gap: 10px;
                    margin-top: 4px;
                }
                .docit-folder-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 10px;
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition:
                        border-color 0.15s,
                        box-shadow 0.15s,
                        transform 0.15s;
                    text-align: center;
                    min-height: 120px;
                }
                .docit-folder-card:hover {
                    border-color: #1677ff;
                    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.12);
                    transform: translateY(-1px);
                }
                .docit-folder-card__name {
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: #262626;
                    line-height: 1.35;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-word;
                }
                .docit .docit-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    border-radius: 10px;
                    padding: 1px 8px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    line-height: 1.4;
                }
                .docit .docit-badge--success {
                    background: #f6ffed;
                    color: #52c41a;
                    border: 1px solid #b7eb8f;
                }
                .docit .docit-price {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #d46b08;
                }
                .docit .docit-btn {
                    border-radius: 4px !important;
                    font-weight: 500 !important;
                    height: 26px !important;
                    padding: 0 10px !important;
                }
                .docit .docit-btn--primary {
                    background-color: #389e0d !important;
                    border-color: #389e0d !important;
                }
                .docit .docit-btn--primary:hover {
                    background-color: #237804 !important;
                    border-color: #237804 !important;
                }
                .docit .docit-btn--blue {
                    background-color: #1677ff !important;
                    border-color: #1677ff !important;
                }
                .docit .ant-list-item-action {
                    margin-inline-start: 12px !important;
                }
                .docit .ant-list-item-action > li {
                    padding: 0 4px !important;
                }
                .docit .ant-list-item-action-split {
                    display: none !important;
                }
                @media (max-width: 576px) {
                    .docit .docit-item {
                        padding: 8px !important;
                    }
                    .docit .ant-list-item {
                        flex-wrap: wrap;
                    }
                    .docit .ant-list-item-action {
                        margin-inline-start: 0 !important;
                        margin-top: 6px;
                        width: 100%;
                        justify-content: flex-end;
                    }
                }
            `}</style>
        </section>
    );
};

export default DocumentItem;
