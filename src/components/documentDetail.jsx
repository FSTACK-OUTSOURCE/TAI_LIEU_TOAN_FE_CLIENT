"use client";
import { useAppContext } from "@/appcontext";
import { checkSignIn, downloadDocument } from "@/constants/client";
import {
    DownloadOutlined,
    ExportOutlined,
    FileExcelOutlined,
    FileOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    FileWordOutlined,
    FileZipOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { Divider, Image } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import DocumentTopup from "./documenttopup";
import "./styles/documentDetail.css";

const isUnembeddableUrl = (url) => {
    if (!url) return true;
    try {
        const u = new URL(url);
        const host = u.hostname;
        const path = u.pathname;
        if (host.includes("drive.google.com")) {
            if (path.includes("/drive/folders/")) return true;
            if (path.includes("/folderview")) return true;
            if (
                path === "/open" &&
                u.searchParams.get("id") &&
                !path.includes("/preview")
            )
                return true;
        }
        if (host.includes("docs.google.com") && path.includes("/folders/"))
            return true;
        if (
            (host.includes("onedrive.live.com") || host.includes("1drv.ms")) &&
            /folder|cid=/i.test(u.search + path)
        )
            return true;
        if (host.includes("mega.nz") && path.includes("/folder/")) return true;
        return false;
    } catch {
        return false;
    }
};

/**
 * Returns preview mode for a URL:
 *   'pdfjs'  → render via self-hosted PDF.js viewer
 *   'iframe' → render via plain iframe (Google Drive preview, etc.)
 *   'newtab' → open in new tab (folder links / unembeddable)
 */
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

const DocumentDetail = ({ documentinfo, childDocumentsCount = 0 }) => {
    const { appcontext } = useAppContext();
    const [showTopup, setShowTopup] = useState(false);

    const detailImages = useMemo(() => {
        const result = [];
        if (documentinfo.IMAGE_LINK)
            result.push(
                `${process.env.NEXT_PUBLIC_API_URL}${documentinfo.IMAGE_LINK}`,
            );
        try {
            const arr = JSON.parse(documentinfo.IMAGES || "[]");
            if (Array.isArray(arr))
                arr.forEach((p) =>
                    result.push(`${process.env.NEXT_PUBLIC_API_URL}${p}`),
                );
        } catch {}
        return result;
    }, [documentinfo.IMAGE_LINK, documentinfo.IMAGES]);

    const thumbnailSrc = documentinfo.IS_FOLDER
        ? "/folder.png"
        : "/docTaiLieu.png";

    const [selectedImg, setSelectedImg] = useState(null);
    const [orderedImages, setOrderedImages] = useState([]);
    const [slideOffset, setSlideOffset] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [needsLoop, setNeedsLoop] = useState(false);
    const stripWrapRef = useRef(null);
    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const THUMB_W = 80; // 72px + 8px gap

    useEffect(() => {
        setOrderedImages(detailImages);
        setSelectedImg(detailImages[0] ?? null);
    }, [detailImages]);

    useEffect(() => {
        if (!stripWrapRef.current || orderedImages.length === 0) return;
        const containerWidth = stripWrapRef.current.offsetWidth;
        setNeedsLoop(orderedImages.length * THUMB_W > containerWidth);
    }, [orderedImages]);

    const handleSelectImg = (img, idx) => {
        if (animating) return;
        setSelectedImg(img);
        if (!needsLoop || idx === 0) return;
        setAnimating(true);
        setSlideOffset(-(idx * THUMB_W));
        setTimeout(() => {
            setOrderedImages((prev) => [
                ...prev.slice(idx),
                ...prev.slice(0, idx),
            ]);
            setSlideOffset(0);
            setAnimating(false);
        }, 300);
    };

    const fileTypeIcon = (type) => {
        const iconStyle = { fontSize: 32 };
        switch ((type || "").toLowerCase()) {
            case "doc":
            case "docx":
                return (
                    <FileWordOutlined
                        style={{ ...iconStyle, color: "#2b579a" }}
                    />
                );
            case "pdf":
                return (
                    <FilePdfOutlined
                        style={{ ...iconStyle, color: "#f40f02" }}
                    />
                );
            case "xls":
            case "xlsx":
                return (
                    <FileExcelOutlined
                        style={{ ...iconStyle, color: "#217346" }}
                    />
                );
            case "ppt":
            case "pptx":
                return (
                    <FilePptOutlined
                        style={{ ...iconStyle, color: "#d24726" }}
                    />
                );
            case "rar":
            case "zip":
                return (
                    <FileZipOutlined
                        style={{ ...iconStyle, color: "#f5a623" }}
                    />
                );
            default:
                return <FileOutlined style={{ ...iconStyle, color: "#888" }} />;
        }
    };

    const [showPreview, setShowPreview] = useState(false);

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const buyDocument = async () => {
        if (!appcontext.username) {
            await checkSignIn();
        } else {
            setShowTopup(true);
        }
    };

    console.log(documentinfo);

    return (
        <div
            className="row document-detail-root"
            style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "2px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
        >
            <div className="col-md-5 col-lg-5 col-xl-5">
                <div style={{ width: "100%" }}>
                    {(() => {
                        const src = selectedImg || detailImages[0];
                        const wrapperStyle = {
                            width: "100%",
                            aspectRatio: "3/4",
                            border: "1px solid #eee",
                            borderRadius: 4,
                            background: "#fafafa",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                        };
                        return src ? (
                            <div style={wrapperStyle}>
                                <Image
                                    src={src}
                                    alt="Tài liệu toán.vn"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={wrapperStyle}>
                                <img
                                    src={thumbnailSrc}
                                    alt="Tài liệu toán.vn"
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "contain",
                                        opacity: 0.6,
                                    }}
                                />
                            </div>
                        );
                    })()}
                    {orderedImages.length > 0 && (
                        <>
                            <div
                                ref={stripWrapRef}
                                style={{ marginTop: 10, overflow: "hidden" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        flexWrap: needsLoop ? "nowrap" : "wrap",
                                        transform: needsLoop
                                            ? `translateX(${slideOffset}px)`
                                            : "none",
                                        transition: animating
                                            ? "transform 0.3s ease"
                                            : "none",
                                    }}
                                >
                                    {orderedImages.map((img, idx) => (
                                        <Image
                                            key={img}
                                            src={img}
                                            alt={`preview-${idx}`}
                                            onClick={() =>
                                                handleSelectImg(img, idx)
                                            }
                                            style={{
                                                flexShrink: 0,
                                                width: 72,
                                                height: 72,
                                                objectFit: "cover",
                                                cursor: animating
                                                    ? "default"
                                                    : "pointer",
                                                borderRadius: 4,
                                                border:
                                                    selectedImg === img
                                                        ? "2px solid #1890ff"
                                                        : "1px solid #ddd",
                                                transition: "border 0.2s",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p
                                style={{
                                    fontStyle: "italic",
                                    fontSize: 14,
                                    color: "#888",
                                    marginTop: 6,
                                    marginBottom: 0,
                                    textAlign: "center",
                                }}
                            >
                                Click vào ảnh để xem chi tiết hơn
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="col-md-7 col-lg-7 col-xl-7">
                {/* name */}
                <div
                    className="form-name"
                    dangerouslySetInnerHTML={{
                        __html: documentinfo?.NAME || "",
                    }}
                />

                {/* info download */}
                {/* <div className="form-info-download">
                    <div className='info-download-item'>
                        <DownloadOutlined style={{color:"#5c6c75"}}/>
                        <span>{888} Lượt tải</span>
                    </div>
                </div> */}

                {/* price */}
                {documentinfo?.PRICE ? (
                    <div className="form-price">
                        <p>
                            {new Intl.NumberFormat("vi-VN").format(
                                documentinfo.PRICE,
                            )}{" "}
                            đ
                        </p>
                    </div>
                ) : null}

                {/*  info */}
                <div className="detail-info row">
                    <div className="col-lg-6">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="100">Lớp:</td>
                                    <td>
                                        <strong>
                                            {documentinfo?.GRADE ||
                                                "đang cập nhật"}
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Môn:</td>
                                    <td>
                                        <strong>
                                            {documentinfo?.SUBJECT ||
                                                "đang cập nhật"}
                                        </strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Số trang:</td>
                                    <td>
                                        <strong>
                                            {documentinfo?.PAGE_COUNT
                                                ? `${documentinfo.PAGE_COUNT} trang`
                                                : "đang cập nhật"}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-6">
                        <table className="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td width="100">File:</td>
                                    <td>
                                        {documentinfo?.FILE_TYPE ? (
                                            fileTypeIcon(documentinfo.FILE_TYPE)
                                        ) : (
                                            <span>đang cập nhật</span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Loại:</td>
                                    <td>
                                        <strong>
                                            {documentinfo?.CATEGORY === "single"
                                                ? "Tài liệu lẻ"
                                                : documentinfo?.CATEGORY ===
                                                    "bundle"
                                                  ? "Tài liệu bộ"
                                                  : "đang cập nhật"}
                                        </strong>
                                        {documentinfo?.CATEGORY === "bundle" &&
                                            childDocumentsCount > 0 && (
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    Bộ tài liệu bao gồm:{" "}
                                                    <strong>
                                                        {childDocumentsCount} TL
                                                        lẻ
                                                    </strong>
                                                    <br />
                                                    <span
                                                        onClick={scrollToBottom}
                                                        style={{
                                                            color: "#1890ff",
                                                            cursor: "pointer",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        ( Xem chi tiết » )
                                                    </span>
                                                </div>
                                            )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/*  Action */}
                <div className="form-action">
                    {console.log(documentinfo)}
                    {!documentinfo.BOUGHT && documentinfo.LINK_FULL ? (
                        <button
                            type="button"
                            className="btn btn-dark rounded-0 me-2 mb-2 mt-2"
                            onClick={() => {
                                const previewUrl = documentinfo.LINK_PREVIEW;
                                const mode = getPreviewMode(previewUrl);
                                if (mode === "newtab") {
                                    window.open(
                                        previewUrl || documentinfo.LINK_FULL,
                                        "_blank",
                                        "noopener,noreferrer",
                                    );
                                } else {
                                    setShowPreview(true);
                                }
                            }}
                        >
                            <FilePdfOutlined style={{ marginRight: "10px" }} />{" "}
                            XEM THỬ
                        </button>
                    ) : null}

                    <button
                        className="btn btn-success rounded-0 mb-2 mt-2"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#buyDocumentModal"
                        onClick={() =>
                            documentinfo?.BOUGHT
                                ? downloadDocument(documentinfo)
                                : buyDocument()
                        }
                    >
                        {documentinfo?.BOUGHT ? (
                            <>
                                <DownloadOutlined
                                    style={{ marginRight: "10px" }}
                                />{" "}
                                TẢI LẠI
                            </>
                        ) : (
                            <>
                                <DownloadOutlined
                                    style={{ marginRight: "10px" }}
                                />{" "}
                                TẢI XUỐNG
                            </>
                        )}
                    </button>
                </div>
                <Divider />

                {/* buy step */}
                <div className="alert alert-info rounded-0" role="alert">
                    MUA NGAY ĐỂ XEM TOÀN BỘ TÀI LIỆU
                </div>
                <div className="order-step">
                    <h6
                        style={{
                            color: "#008000",
                        }}
                    >
                        CÁCH TẢI TÀI LIỆU:
                    </h6>
                    <ul className="ps-4">
                        <li className="mb-1">
                            <strong>Bước 1:</strong> Nếu số dư tài khoản đủ, bạn
                            chỉ cần ấn nút <strong>TẢI XUỐNG</strong>.
                        </li>
                        <li className="mb-1">
                            <strong>Bước 2:</strong> Nếu số dư không đủ, ấn TẢI
                            XUỐNG để mở bảng chọn <strong>Nạp tiền</strong>. Sau
                            đó chọn số tiền muốn nạp và quét mã QR để thanh
                            toán.
                        </li>
                        <li className="mb-1">
                            <strong>Bước 3:</strong> Sau khi thanh toán thành
                            công, vui lòng chụp lại giao dịch rồi gửi đến số
                            Zalo{" "}
                            <a
                                href="https://zalo.me/0386117490"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <strong>0386.117.490</strong>{" "}
                                <span>(nhấn vào đây)</span>
                            </a>{" "}
                            để được xác nhận.
                        </li>
                        <li className="mb-1">
                            <strong>Bước 4:</strong> Sau khi được xác nhận thành
                            công, quay lại trang này và tải tài liệu.
                        </li>
                    </ul>
                    <p
                        className="mt-2 ms-3"
                        style={{
                            fontSize: "16px",
                        }}
                    >
                        <a
                            className="btn btn-info btn-sm rounded-0"
                            style={{
                                color: "#fff",
                                fontSize: "16px",
                                padding: "3px 7px",
                            }}
                            href="https://zalo.me/0386117490"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Tư vấn nhanh
                        </a>
                        <PhoneOutlined style={{ margin: "0 8px" }} />
                        <span className="d-none d-md-inline">
                            Hotline hỗ trợ:
                        </span>
                        <span className="fs-5" style={{ color: "#FF5722" }}>
                            {" "}
                            0386.117.490{" "}
                        </span>
                    </p>
                </div>
                <Divider />

                {/* description */}
                <div ref={bottomRef}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: documentinfo.DESCRIPTION,
                        }}
                    />
                </div>
            </div>
            {/* MOdal */}
            {showTopup && (
                <DocumentTopup props={{ onClose: toggleTopup, documentinfo }} />
            )}

            {showPreview && (
                <div
                    onClick={() => setShowPreview(false)}
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
                                    href={documentinfo.LINK_PREVIEW}
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
                                    onClick={() => setShowPreview(false)}
                                />
                            </div>
                        </div>
                        <iframe
                            src={
                                getPreviewMode(documentinfo.LINK_PREVIEW) ===
                                "pdfjs"
                                    ? buildPdfjsUrl(documentinfo.LINK_PREVIEW)
                                    : documentinfo.LINK_PREVIEW
                            }
                            title="Xem thử tài liệu"
                            style={{ flex: 1, border: "none", width: "100%" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentDetail;
