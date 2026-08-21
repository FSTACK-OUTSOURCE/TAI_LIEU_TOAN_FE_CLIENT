"use client"
import React, { useEffect, useState } from "react";
import { Image } from 'antd';
import { useRouter } from 'next/navigation';
import {
    FacebookFilled,
    MessageFilled,
    CustomerServiceFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { getConfig } from "@/constants/server";
import { useAppContext } from "@/appcontext";

const BRAND = {
    primary: "#c0392b",
    primaryDark: "#8e2a1f",
    cream: "#fdf9ed",
    creamDark: "#f4ecd3",
    text: "#2b2b2b",
    muted: "#6b6b6b",
    border: "rgba(0,0,0,0.08)",
};

const columnTitleStyle = {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    color: BRAND.primaryDark,
    marginBottom: 16,
    position: "relative",
    paddingBottom: 10,
};

const titleUnderlineStyle = {
    content: "",
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 36,
    height: 2,
    background: BRAND.primary,
    borderRadius: 2,
    display: "block",
};

const linkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: BRAND.text,
    textDecoration: "none",
    fontSize: 14,
    lineHeight: "28px",
    transition: "color .2s ease",
    cursor: "pointer",
};

const socialBtnStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    transition: "transform .2s ease, box-shadow .2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
};

const Footer = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();
    const [configs, setConfigs] = useState([]);

    useEffect(() => {
        if (appcontext?.configs) {
            setConfigs(appcontext.configs);
        }
    }, [appcontext]);

    const redirectLink = (link) => {
        if (!link) return;
        window.open(link, "_blank")?.focus();
    };

    const zaloLink = getConfig({ configs, name: "zalo" });
    const facebookLink = getConfig({ configs, name: "facebook" });
    const footerHtml = getConfig({ configs, name: "footer" });
    const hotline = getConfig({ configs, name: "hotline" });
    const email = getConfig({ configs, name: "email" });
    const address = getConfig({ configs, name: "address" });

    const year = new Date().getFullYear();

    return (
        <footer
            style={{
                background: `linear-gradient(180deg, ${BRAND.cream} 0%, ${BRAND.creamDark} 100%)`,
                color: BRAND.text,
                borderTop: `3px solid ${BRAND.primary}`,
                marginTop: 40,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "56px 32px 24px",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr 1fr 1.1fr",
                        gap: 40,
                        alignItems: "flex-start",
                    }}
                    className="footer-grid"
                >
                    {/* Brand */}
                    <div>
                        <Image
                            src="/logo.png"
                            alt="Tài liệu toán.vn"
                            preview={false}
                            style={{ cursor: "pointer", width: 220, maxWidth: "100%" }}
                            onClick={() => router.push(`/`, { scroll: false })}
                        />
                        <p
                            style={{
                                marginTop: 16,
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: BRAND.muted,
                                maxWidth: 360,
                            }}
                        >
                            Kho tài liệu Toán học chất lượng cao dành cho học sinh,
                            giáo viên và phụ huynh. Luôn cập nhật nhanh chóng, chính
                            xác và đầy đủ nhất.
                        </p>

                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 14,
                                padding: "6px 12px",
                                background: "#fff",
                                border: `1px solid ${BRAND.border}`,
                                borderRadius: 999,
                                fontSize: 13,
                                color: BRAND.primaryDark,
                                fontWeight: 600,
                            }}
                        >
                            <SafetyCertificateOutlined />
                            Đã thông báo Bộ Công Thương
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <div style={columnTitleStyle}>
                            Khám phá
                            <span style={titleUnderlineStyle} />
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li>
                                <a
                                    style={linkStyle}
                                    onClick={() => router.push(`/`, { scroll: false })}
                                >
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a
                                    style={linkStyle}
                                    onClick={() => router.push(`/search`, { scroll: false })}
                                >
                                    Tìm kiếm tài liệu
                                </a>
                            </li>
                            <li>
                                <a
                                    style={linkStyle}
                                    onClick={() => router.push(`/blog`, { scroll: false })}
                                >
                                    Tin tức & Kiến thức
                                </a>
                            </li>
                            <li>
                                <a
                                    style={linkStyle}
                                    onClick={() => router.push(`/bought`, { scroll: false })}
                                >
                                    Tài liệu của tôi
                                </a>
                            </li>
                            <li>
                                <a
                                    style={linkStyle}
                                    onClick={() => router.push(`/transaction`, { scroll: false })}
                                >
                                    Lịch sử giao dịch
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div style={columnTitleStyle}>
                            Liên hệ
                            <span style={titleUnderlineStyle} />
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {hotline && (
                                <li style={{ ...linkStyle, cursor: "default" }}>
                                    <PhoneOutlined style={{ color: BRAND.primary }} />
                                    <span>{hotline}</span>
                                </li>
                            )}
                            {email && (
                                <li style={{ ...linkStyle, cursor: "default" }}>
                                    <MailOutlined style={{ color: BRAND.primary }} />
                                    <span>{email}</span>
                                </li>
                            )}
                            {address && (
                                <li style={{ ...linkStyle, cursor: "default", alignItems: "flex-start" }}>
                                    <EnvironmentOutlined style={{ color: BRAND.primary, marginTop: 6 }} />
                                    <span>{address}</span>
                                </li>
                            )}
                            <li style={{ ...linkStyle, cursor: "default", alignItems: "flex-start" }}>
                                <ClockCircleOutlined style={{ color: BRAND.primary, marginTop: 6 }} />
                                <span>Hỗ trợ 24/7 – Cả ngày lễ & cuối tuần</span>
                            </li>
                        </ul>
                    </div>

                    {/* Connect / Social */}
                    <div>
                        <div style={columnTitleStyle}>
                            Kết nối với chúng tôi
                            <span style={titleUnderlineStyle} />
                        </div>

                        <p
                            style={{
                                fontSize: 14,
                                color: BRAND.muted,
                                marginBottom: 14,
                                lineHeight: 1.6,
                            }}
                        >
                            Nhắn tin trực tiếp để được tư vấn tài liệu hoặc hỗ trợ kỹ thuật nhanh nhất.
                        </p>

                        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                            <span
                                onClick={() => redirectLink(facebookLink)}
                                title="Facebook"
                                style={{
                                    ...socialBtnStyle,
                                    background: "linear-gradient(135deg, #1877f2, #0e5fc4)",
                                }}
                            >
                                <FacebookFilled />
                            </span>
                            <span
                                onClick={() => redirectLink(zaloLink)}
                                title="Zalo"
                                style={{
                                    ...socialBtnStyle,
                                    background: "linear-gradient(135deg, #0068ff, #0050c9)",
                                }}
                            >
                                <MessageFilled />
                            </span>
                            <span
                                onClick={() => redirectLink(zaloLink)}
                                title="Hỗ trợ kỹ thuật"
                                style={{
                                    ...socialBtnStyle,
                                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                                }}
                            >
                                <CustomerServiceFilled />
                            </span>
                        </div>

                        <div
                            onClick={() => redirectLink(zaloLink)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 18px",
                                background: BRAND.primary,
                                color: "#fff",
                                borderRadius: 999,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                boxShadow: "0 6px 16px rgba(192,57,43,0.25)",
                                transition: "transform .2s ease",
                            }}
                        >
                            <MessageFilled /> Chat Zalo ngay
                        </div>
                    </div>
                </div>

                {/* Optional CMS-configured footer HTML */}
                {footerHtml && (
                    <div
                        style={{
                            marginTop: 40,
                            paddingTop: 24,
                            borderTop: `1px dashed ${BRAND.border}`,
                            fontSize: 14,
                            color: BRAND.muted,
                            lineHeight: 1.7,
                        }}
                        dangerouslySetInnerHTML={{ __html: footerHtml }}
                    />
                )}
            </div>

            {/* Copyright bar */}
            <div
                style={{
                    borderTop: `1px solid ${BRAND.border}`,
                    background: "rgba(255,255,255,0.5)",
                }}
            >
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "16px 32px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 13,
                        color: BRAND.muted,
                    }}
                >
                    <div>
                        © {year} <strong style={{ color: BRAND.primaryDark }}>Tài liệu Toán.vn</strong>. Bảo lưu mọi quyền.
                    </div>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <span style={{ cursor: "pointer" }}>Điều khoản sử dụng</span>
                        <span style={{ cursor: "pointer" }}>Chính sách bảo mật</span>
                        <span style={{ cursor: "pointer" }}>Chính sách thanh toán</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 992px) {
                    :global(.footer-grid) {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 600px) {
                    :global(.footer-grid) {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
