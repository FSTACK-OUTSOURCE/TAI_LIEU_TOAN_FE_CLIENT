"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { HomeOutlined, InfoCircleOutlined, FileOutlined, PhoneOutlined, ReadOutlined } from "@ant-design/icons";
import { AdminPhoneNumber } from "@/constants/dataCommon";
import { useAppContext } from "@/appcontext";
import { getConfig } from "@/constants/server";

const Sidebar = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();

    const textStyles = {
        color: "#ffffff",
        fontWeight: 400,
        fontSize: "14px",
        marginBottom: "0px",
    }

    const redirectLink = (link) => {
        if (!link) return;
        window.open(link, "_blank")?.focus();
    }

    const callHotline = () => {
        const tel = AdminPhoneNumber.replace(/\D/g, "");
        window.location.href = `tel:${tel}`;
    }

    return (
        <div style={{
            paddingRight: "20px",
            height: "42px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: "20px",
            background: "#0074a6",
        }}>
            <FormCommon action={() => router.push(`/`, { scroll: false })}>
                <HomeOutlined style={{ color: "#fff" }} />
                <p style={textStyles}>Trang chủ</p>
            </FormCommon>
            <FormCommon action={() => router.push('/blog', { scroll: false })}>
                <ReadOutlined style={{ color: "#fff" }} />
                <p style={textStyles}>Blog</p>
            </FormCommon>
            <FormCommon action={() => router.push('/search?price=0', { scroll: false })}>
                <FileOutlined style={{ color: "#fff" }} />
                <p style={textStyles}>Tài liệu miễn phí</p>
            </FormCommon>
            <FormCommon action={() => redirectLink(getConfig({ configs: appcontext?.configs, name: 'zalo' }))}>
                <InfoCircleOutlined style={{ color: "#fff" }} />
                <p style={textStyles}>Hướng dẫn</p>
            </FormCommon>
            <FormCommon action={callHotline}>
                <PhoneOutlined style={{ color: "#fff" }} />
                <p style={textStyles}>{AdminPhoneNumber}</p>
            </FormCommon>
        </div>
    );
}

export default Sidebar;

const FormCommon = ({ children, action }) => {
    return <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
    }} onClick={action}>{children}</div>
}
