"use client";
import { useAppContext } from "@/appcontext";
import DocumentEditModal from "@/components/documentEditModal";
import DocumentTopup from "@/components/documenttopup";
import { checkSignIn, downloadDocument } from "@/constants/client";
import { buildDocumentEditUrl, canEditDocument } from "@/constants/documentEdit";
import { normalizePreviewUrl } from "@/constants/preview";
import {
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    ExportOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FilePptOutlined,
    FileZipOutlined,
    FileTextOutlined,
    ReadOutlined,
    RightOutlined,
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

const isUnembeddableUrl = (url) => {
    if (!url) return true;
    try {
        const u = new URL(url);
        const host = u.hostname;
        const path = u.pathname;
        if (host.includes("drive.google.com")) {
            if (path.includes("/drive/folders/")) return true;
            if (path.includes("/folderview")) return true;
            if (path === "/open" && u.searchParams.get("id")) return true;
        }
        if (host.includes("docs.google.com") && path.includes("/folders/")) {
            return true;
        }
        if (
            (host.includes("onedrive.live.com") || host.includes("1drv.ms")) &&
            /folder|cid=/i.test(u.search + path)
        ) {
            return true;
        }
        if (host.includes("mega.nz") && path.includes("/folder/")) return true;
        return false;
    } catch {
        return false;
    }
};

const getPreviewMode = (url) => {
    if (!url) return "newtab";
    if (isUnembeddableUrl(url)) return "newtab";
    try {
        const u = new URL(url, window.location.origin);
        const path = u.pathname.toLowerCase();
        const host = u.hostname.toLowerCase();
        const apiHost = (() => {
            try {
                return new URL(process.env.NEXT_PUBLIC_API_URL || "").hostname;
            } catch {
                return "";
            }
        })();
        const isDirectPdf =
            path.endsWith(".pdf") ||
            (apiHost && host === apiHost) ||
            host === window.location.hostname;
        if (isDirectPdf) return "pdfjs";
        return "iframe";
    } catch {
        return "iframe";
    }
};

const buildPdfjsUrl = (fileUrl) =>
    `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;

const FILE_TYPE_META = {
    doc: { label: "WORD", color: "#2b579a", Icon: FileWordOutlined },
    docx: { label: "WORD", color: "#2b579a", Icon: FileWordOutlined },
    pdf: { label: "PDF", color: "#f40f02", Icon: FilePdfOutlined },
    xls: { label: "EXCEL", color: "#217346", Icon: FileExcelOutlined },
    xlsx: { label: "EXCEL", color: "#217346", Icon: FileExcelOutlined },
    ppt: { label: "PPT", color: "#d24726", Icon: FilePptOutlined },
    pptx: { label: "PPT", color: "#d24726", Icon: FilePptOutlined },
    zip: { label: "ZIP", color: "#f5a623", Icon: FileZipOutlined },
    rar: { label: "RAR", color: "#f5a623", Icon: FileZipOutlined },
};

const getFileTypeMeta = (type) =>
    FILE_TYPE_META[(type || "").toLowerCase()] || {
        label: (type || "FILE").toUpperCase(),
        color: "#8c8c8c",
        Icon: FileTextOutlined,
    };

const DocumentItem = ({ props }) => {
    const { documentinfo, topics, isShowDetail, isBundle, parentDocument } =
        props;
    const [displayDocuments, setDisplayDocuments] = useState([]);
    const [childDocumentInfo, setChildDocumentInfo] = useState({});
    const [selectedTopicIds, setSelectedTopicIds] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [showTopup, setShowTopup] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const { appcontext, setAppContext } = useAppContext();
    const router = useRouter();
    const showEditButton = canEditDocument(appcontext);

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const openPreview = (url) => {
        const normalizedUrl = normalizePreviewUrl(url);
        const mode = getPreviewMode(normalizedUrl);
        if (mode === "newtab") {
            window.open(normalizedUrl, "_blank", "noopener,noreferrer");
            return;
        }
        setPreviewUrl(normalizedUrl);
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
                        ✓ Đã mua
                    </span>,
                );
            }
        }

        if (isShowDetail && item.LINK_PREVIEW) {
            result.push(
                <Button
                    key="preview"
                    className="docit-btn docit-btn--preview"
                    type="text"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        openPreview(item.LINK_PREVIEW);
                    }}
                >
                    Xem thử
                </Button>,
            );
        }

        if (showEditButton) {
            result.push(
                <Button
                    key="edit"
                    className="docit-btn docit-btn--edit"
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditUrl(buildDocumentEditUrl(item));
                    }}
                >
                    Chỉnh sửa
                </Button>,
            );
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

                    <List
                            pagination={{
                                pageSize: 10,
                                size: "small",
                                locale: { items_per_page: "/ trang" },
                            }}
                            dataSource={displayDocuments}
                            renderItem={(item) => {
                                const ft = getFileTypeMeta(item.FILE_TYPE);
                                const openItem = () => {
                                    const url = `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`;
                                    if (item.PRICE) {
                                        window.open(url, "_blank");
                                    } else {
                                        router.push(url, { scroll: false });
                                    }
                                };
                                return (
                                    <List.Item
                                        className="docit-item"
                                        onClick={openItem}
                                        actions={getActions(item)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <div className="docit-item__avatar">
                                                    <Image
                                                        preview={false}
                                                        src={
                                                            item.IMAGE_LINK
                                                                ? item.IMAGE_LINK.startsWith('https://')
                                                                    ? item.IMAGE_LINK
                                                                    : `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}`
                                                                : item.IS_FOLDER
                                                                  ? "/folder.png"
                                                                  : "/docTaiLieu.png"
                                                        }
                                                        alt="Tài liệu"
                                                        width={64}
                                                        height={64}
                                                    />
                                                    {!item.IS_FOLDER && (
                                                        <span
                                                            className="docit-item__filetag"
                                                            style={{
                                                                background:
                                                                    ft.color,
                                                            }}
                                                        >
                                                            <ft.Icon />
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                            title={
                                                <span
                                                    className="docit-item__title customLink"
                                                    title={item.NAME}
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.NAME,
                                                    }}
                                                />
                                            }
                                            description={
                                                <div className="docit-item__meta">
                                                    {!item.IS_FOLDER && (
                                                        <span
                                                            className="docit-chip"
                                                            style={{
                                                                color: ft.color,
                                                                borderColor: `${ft.color}40`,
                                                            }}
                                                        >
                                                            <ft.Icon />
                                                            {ft.label}
                                                        </span>
                                                    )}
                                                    {item.GRADE && (
                                                        <span className="docit-chip">
                                                            <ReadOutlined />
                                                            Lớp {item.GRADE}
                                                        </span>
                                                    )}
                                                    {item.SUBJECT && (
                                                        <span className="docit-chip">
                                                            {item.SUBJECT}
                                                        </span>
                                                    )}
                                                    {item.PRICE != null && (
                                                        <span
                                                            className={
                                                                item.PRICE === 0
                                                                    ? "docit-chip docit-chip--free"
                                                                    : "docit-chip docit-chip--price"
                                                            }
                                                        >
                                                            {item.PRICE === 0
                                                                ? "FREE"
                                                                : `${new Intl.NumberFormat(
                                                                      "vi-VN",
                                                                  ).format(
                                                                      item.PRICE,
                                                                  )}đ`}
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                        />
                                        <RightOutlined className="docit-item__arrow" />
                                    </List.Item>
                                );
                            }}
                        />
                </>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <iframe
                        src={normalizePreviewUrl(documentinfo.LINK_PREVIEW)}
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

            <DocumentEditModal
                url={editUrl}
                onClose={() => setEditUrl("")}
                title="Chỉnh sửa tài liệu"
            />

            {previewUrl && (
                <div
                    onClick={() => setPreviewUrl("")}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            borderRadius: 8,
                            width: "60vw",
                            height: "90vh",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            padding: "0 10px 10px 10px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 16px",
                                borderBottom: "1px solid #eee",
                                flexShrink: 0,
                                gap: 12,
                            }}
                        >
                            <span style={{ fontWeight: 600, fontSize: 15 }}>
                                <FilePdfOutlined
                                    style={{ color: "#f40f02", marginRight: 8 }}
                                />
                                Xem thử tài liệu
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "4px 12px",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "#1677ff",
                                        border: "1px solid #1677ff",
                                        borderRadius: 4,
                                        textDecoration: "none",
                                    }}
                                >
                                    <ExportOutlined /> Mở tab mới
                                </a>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setPreviewUrl("")}
                                />
                            </div>
                        </div>
                        <iframe
                            src={
                                getPreviewMode(previewUrl) === "pdfjs"
                                    ? buildPdfjsUrl(previewUrl)
                                    : previewUrl
                            }
                            title="Xem thử tài liệu"
                            style={{ flex: 1, border: "none", width: "100%" }}
                        />
                    </div>
                </div>
            )}

            <style jsx global>{`
                .docit .docit-item {
                    padding: 14px 18px !important;
                    margin-bottom: 10px;
                    background: #fff;
                    border: 1px solid #ececec !important;
                    border-radius: 12px;
                    cursor: pointer;
                    transition:
                        border-color 0.18s ease,
                        background 0.18s ease,
                        box-shadow 0.18s ease,
                        transform 0.18s ease;
                    min-height: 92px;
                }
                .docit .docit-item:hover {
                    border-color: #91caff !important;
                    background: #fafcff;
                    box-shadow: 0 6px 18px rgba(22, 119, 255, 0.1);
                    transform: translateY(-2px);
                }
                .docit .docit-item:hover .docit-item__title {
                    color: #1677ff;
                }
                .docit .docit-item:hover .docit-item__arrow {
                    color: #1677ff;
                    transform: translateX(3px);
                }
                .docit .docit-item__avatar {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #f5f5f5;
                    border: 1px solid #f0f0f0;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .docit .docit-item__avatar .ant-image-img {
                    object-fit: cover;
                    border-radius: 10px;
                }
                .docit .docit-item__filetag {
                    position: absolute;
                    right: -1px;
                    bottom: -1px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 7px 0 9px 0;
                    color: #fff;
                    font-size: 12px;
                }
                .docit .docit-item__title {
                    border: none;
                    background: none;
                    text-align: left;
                    padding: 0;
                    font-size: 0.97rem;
                    line-height: 1.45;
                    cursor: pointer;
                    overflow-wrap: anywhere;
                    word-break: normal;
                    white-space: normal;
                    width: 100%;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-weight: 600;
                    color: #1f1f1f;
                    transition: color 0.18s ease;
                }
                .docit .docit-item__meta {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px;
                    margin-top: 8px;
                }
                .docit .docit-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 9px;
                    font-size: 0.74rem;
                    font-weight: 600;
                    line-height: 1.6;
                    color: #595959;
                    background: #f5f5f5;
                    border: 1px solid #ededed;
                    border-radius: 6px;
                    white-space: nowrap;
                }
                .docit .docit-chip--free {
                    color: #389e0d;
                    background: #f6ffed;
                    border-color: #b7eb8f;
                }
                .docit .docit-chip--price {
                    color: #d46b08;
                    background: #fff7e6;
                    border-color: #ffd591;
                }
                .docit .docit-item__arrow {
                    color: #bfbfbf;
                    font-size: 14px;
                    margin-left: 8px;
                    flex-shrink: 0;
                    transition:
                        color 0.18s ease,
                        transform 0.18s ease;
                }
                .docit .ant-list-item-meta {
                    display: flex !important;
                    align-items: flex-start;
                    min-width: 0 !important;
                    flex: 1 1 0% !important;
                }
                .docit .ant-list-item {
                    align-items: center;
                }
                .docit .ant-list-item-meta-content {
                    flex: 1 1 0% !important;
                    min-width: 0 !important;
                    width: auto !important;
                }
                .docit .ant-list-item-meta-avatar {
                    margin-right: 16px !important;
                    flex-shrink: 0 !important;
                }
                .docit .docit-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    border-radius: 12px;
                    padding: 4px 12px;
                    font-size: 0.78rem;
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
                .docit .docit-btn--preview {
                    background: #f5f5f5 !important;
                    color: #262626 !important;
                    border: 1px solid #eeeeee !important;
                }
                .docit .docit-btn--preview:hover {
                    background: #e6f4ff !important;
                    color: #0958d9 !important;
                    border-color: #91caff !important;
                }
                .docit .docit-btn--full {
                    background: #fff !important;
                    color: #0f766e !important;
                    border: 1px solid #99f6e4 !important;
                }
                .docit .docit-btn--full:hover {
                    background: #ccfbf1 !important;
                    color: #115e59 !important;
                    border-color: #5eead4 !important;
                }
                .docit .docit-btn--edit {
                    background: #fff !important;
                    color: #1677ff !important;
                    border: 1px solid #91caff !important;
                }
                .docit .docit-btn--edit:hover {
                    background: #e6f4ff !important;
                    color: #0958d9 !important;
                    border-color: #69b1ff !important;
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
                        flex-direction: column;
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
