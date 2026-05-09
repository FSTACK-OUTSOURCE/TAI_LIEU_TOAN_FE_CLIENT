"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HomeOutlined, InfoCircleOutlined, FileOutlined, PhoneOutlined, ReadOutlined } from "@ant-design/icons";
import { AdminPhoneNumber } from "@/constants/dataCommon";
import { useAppContext } from "@/appcontext";
import { getConfig } from "@/constants/server";

const Sidebar = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();

    const redirectLink = (link) => {
        if (!link) return;
        window.open(link, "_blank")?.focus();
    }

    const callHotline = () => {
        const tel = AdminPhoneNumber.replace(/\D/g, "");
        window.location.href = `tel:${tel}`;
    }

    const items = [
        { icon: <HomeOutlined />, label: "Trang chủ", action: () => router.push(`/`, { scroll: false }) },
        { icon: <ReadOutlined />, label: "Blog", action: () => router.push(`/blog`, { scroll: false }) },
        { icon: <FileOutlined />, label: "Tài liệu miễn phí", action: () => router.push(`/search?price=0`, { scroll: false }) },
        { icon: <InfoCircleOutlined />, label: "Hướng dẫn", action: () => redirectLink(getConfig({ configs: appcontext?.configs, name: 'zalo' })) },
        { icon: <PhoneOutlined />, label: AdminPhoneNumber, action: callHotline, highlight: true },
    ];

    return (
        <div className="sidebar-nav">
            <div className="sidebar-nav__inner">
                {items.map((it, i) => (
                    <NavItem key={i} {...it} />
                ))}
            </div>
            <style jsx global>{`
                .sidebar-nav {
                    width: 100%;
                    height: 44px;
                    display: flex;
                    align-items: stretch;
                    justify-content: flex-end;
                    padding-right: 20px;
                    background: linear-gradient(90deg, #006590 0%, #0088c2 100%);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }
                .sidebar-nav__inner {
                    display: flex;
                    align-items: stretch;
                }
                @media (max-width: 768px) {
                    .sidebar-nav {
                        height: 40px;
                        padding-right: 0;
                        justify-content: flex-start;
                        overflow-x: auto;
                        overflow-y: hidden;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                    }
                    .sidebar-nav::-webkit-scrollbar { display: none; }
                    .sidebar-nav__inner {
                        flex: 0 0 auto;
                        margin: 0 auto;
                        min-width: max-content;
                    }
                    .sidebar-nav__inner > div {
                        padding: 0 12px !important;
                        font-size: 13px !important;
                    }
                }
            `}</style>
        </div>
    );
}

const NavItem = ({ icon, label, action, highlight }) => {
    const [hover, setHover] = useState(false);

    return (
        <div
            onClick={action}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: highlight ? 600 : 400,
                cursor: "pointer",
                position: "relative",
                background: hover ? "rgba(255,255,255,0.12)" : "transparent",
                transition: "background 0.2s ease",
            }}
        >
            <span style={{ color: "#fff", display: "inline-flex" }}>{icon}</span>
            <span>{label}</span>
            <span
                style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 6,
                    height: 2,
                    background: "#fdcd02",
                    borderRadius: 2,
                    transform: hover ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform 0.25s ease",
                }}
            />
        </div>
    );
}

export default Sidebar;
