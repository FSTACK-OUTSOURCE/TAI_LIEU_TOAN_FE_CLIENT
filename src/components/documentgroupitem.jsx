"use client";
import { useAppContext } from "@/appcontext";
import DocumentPreview from "@/components/documentpreview";
import DocumentTopup from "@/components/documenttopup";
import { checkSignIn, downloadDocument } from "@/constants/client";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Slider from "react-slick";
import "./styles/documentGroupItem.css";

const CustomArrow = ({ className, style, onClick, direction }) => (
    <div
        className={`${className} custom-arrow-slider`}
        style={{
            ...style,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
            [direction === "left" ? "left" : "right"]: "-18px",
        }}
        onClick={onClick}
    >
        <span style={{ color: "#666", fontSize: "16px", lineHeight: "1" }}>
            {direction === "left" ? "❮" : "❯"}
        </span>
    </div>
);

const DocumentGroupItem = ({ props }) => {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [showTopup, setShowTopup] = useState(false);
    const [childDocumentInfo, setChildDocumentInfo] = useState({});
    const { appcontext, setAppContext } = useAppContext();
    const { groups } = props;

    const settings = {
        dots: true,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 3,
        nextArrow: <CustomArrow direction="right" />,
        prevArrow: <CustomArrow direction="left" />,
        infinite: true,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
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
    const togglePopup = (item) => {
        setChildDocumentInfo(item);
        setShowPopup(!showPopup);
    };

    const toggleTopup = () => {
        setShowTopup(!showTopup);
    };

    const getActions = (item) => {
        var result = [];

        if (!item.IS_FOLDER && item.PRICE) {
            if (checkDownloaded(item.DOCUMENT_ID)) {
                result.push(<span>Đã tải</span>);
            }

            if (!item.BOUGHT) {
                result.push(
                    <label className="font10pt fontBold fontBlack">
                        Giá tiền:{" "}
                        <span className="colorTaiLieu">
                            {new Intl.NumberFormat("vi-VN").format(item.PRICE)}
                        </span>
                    </label>,
                );
                result.push(
                    <Button
                        style={{ marginLeft: 3, backgroundColor: "green" }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size={"small"}
                        onClick={() => {
                            buyDocument(item);
                        }}
                    >
                        Tải về
                    </Button>,
                );
                if (item.LINK_PREVIEW) {
                    result.push(
                        <Button
                            style={{
                                marginLeft: 3,
                                backgroundColor: "#fb6a00",
                            }}
                            type="primary"
                            icon={<EyeOutlined />}
                            size={"small"}
                            onClick={() => {
                                togglePopup(item);
                            }}
                        >
                            Xem thử
                        </Button>,
                    );
                }
                if (item.LINK_FULL) {
                    result.push(
                        <Button
                            style={{ marginLeft: 3 }}
                            type="primary"
                            icon={<EyeOutlined />}
                            size={"small"}
                            onClick={() => {
                                window.open(`${item.LINK_FULL}`);
                            }}
                        >
                            Xem thử gói
                        </Button>,
                    );
                }
            } else {
                result.push(
                    <Button
                        style={{ marginLeft: 3, backgroundColor: "#5ab5ff" }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size={"small"}
                        onClick={() => {
                            downloadDocument(item);
                        }}
                    >
                        Đã mua
                    </Button>,
                );
            }
        }

        return result;
    };

    return (
        <section
            className="doc-group-section"
            style={{
                marginTop: 50,
            }}
        >
            <div style={{ paddingBottom: "20px" }}>
                {groups.map((group, index) => (
                    <div
                        key={index}
                        className="doc-group-item"
                        style={{ marginBottom: "100px" }}
                    >
                        <div
                            className="doc-group-header"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid #e0e0e0",
                                paddingBottom: "10px",
                                marginBottom: "20px",
                                marginLeft: "25px",
                                marginRight: "25px",
                            }}
                        >
                            <img
                                src="/docTaiLieu.png"
                                alt="icon"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    marginRight: "10px",
                                }}
                            />
                            <span
                                style={{
                                    color: "#333",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    textTransform: "uppercase",
                                }}
                            >
                                {group.GROUP_NAME}
                            </span>
                        </div>

                        {group.documents && group.documents.length > 0 ? (
                            <div
                                className="doc-group-slider-wrap"
                                style={{ padding: "0 25px" }}
                            >
                                <Slider {...settings}>
                                    {group.documents.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{ padding: "10px" }}
                                        >
                                            <div
                                                style={{
                                                    margin: "0 5px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    background: "#fff",
                                                    borderRadius: "8px",
                                                    border: "1px solid #f0f0f0",
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.06)",
                                                    overflow: "hidden",
                                                    height: "100%",
                                                }}
                                            >
                                                <div
                                                    className="doc-group-card-thumb"
                                                    style={{
                                                        width: "100%",
                                                        height: "160px",
                                                        background: "#f8f9fa",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        router.push(
                                                            `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`,
                                                            { scroll: false },
                                                        );
                                                    }}
                                                >
                                                    <Image
                                                        preview={false}
                                                        fallback="/docTaiLieu.png"
                                                        src={
                                                            item.IMAGE_LINK
                                                                ? item.IMAGE_LINK.startsWith('https://')
                                                                    ? item.IMAGE_LINK
                                                                    : `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}`
                                                                : item.IS_FOLDER
                                                                  ? "/folder.png"
                                                                  : "/docTaiLieu.png"
                                                        }
                                                        alt={item.NAME}
                                                        style={{
                                                            width: "100%",
                                                            height: "160px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        padding: "12px",
                                                        width: "100%",
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        router.push(
                                                            `/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`,
                                                            { scroll: false },
                                                        );
                                                    }}
                                                >
                                                    <div
                                                        className="customLink font12pt boxDocument"
                                                        title={item.NAME}
                                                        style={{
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            textAlign: "left",
                                                            fontWeight: "600",
                                                            color: "#333",
                                                            lineHeight: "1.4",
                                                        }}
                                                    >
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: item.NAME,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        padding: "12px",
                                                        borderTop:
                                                            "1px solid #f0f0f0",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        background: "#fafafa",
                                                    }}
                                                >
                                                    {getActions(item).map(
                                                        (action, actionIdx) => (
                                                            <React.Fragment
                                                                key={actionIdx}
                                                            >
                                                                {action}
                                                            </React.Fragment>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding: "0 25px",
                                    textAlign: "center",
                                    color: "#999",
                                }}
                            >
                                Không có tài liệu
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showPopup && (
                <DocumentPreview
                    props={{
                        documentinfo: childDocumentInfo,
                        onClose: togglePopup,
                    }}
                />
            )}
            {showTopup && (
                <DocumentTopup
                    props={{
                        onClose: toggleTopup,
                        documentinfo: childDocumentInfo,
                    }}
                />
            )}
        </section>
    );
};

export default DocumentGroupItem;
