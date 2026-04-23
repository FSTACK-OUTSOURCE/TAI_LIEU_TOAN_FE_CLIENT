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
        <div
            style={{
                width: "100%",
                height: 44,
                display: "flex",
                alignItems: "stretch",
                justifyContent: "flex-end",
                paddingRight: 20,
                background: "linear-gradient(90deg, #006590 0%, #0088c2 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
        >
            {items.map((it, i) => (
                <NavItem key={i} {...it} />
            ))}
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
