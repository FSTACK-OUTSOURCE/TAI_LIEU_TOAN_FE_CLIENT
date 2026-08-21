"use client";
import { useState } from "react";
import { Card, Input, Typography, Tag, Space, message } from "antd";
import { CopyOutlined, LinkOutlined } from "@ant-design/icons";
import UploadButton from "@/components/uploadbutton";

export const dynamic = "force-dynamic";

const formatBytes = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const Page = () => {
    const [history, setHistory] = useState([]);

    const handleUploaded = (data) => {
        setHistory((h) => [{ ...data, at: Date.now() }, ...h]);
    };

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success("Đã sao chép URL");
        } catch {
            message.error("Sao chép thất bại");
        }
    };

    return (
        <>
            <main
                style={{
                    minHeight: "100vh",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    padding: "32px 16px",
                }}
            >
                <div style={{ maxWidth: 880, margin: "0 auto" }}>
                    <Typography.Title
                        level={3}
                        style={{ color: "#e2e8f0", marginBottom: 4 }}
                    >
                        Internal File Upload
                    </Typography.Title>
                    <Typography.Paragraph
                        style={{ color: "#94a3b8", marginBottom: 24 }}
                    >
                        Upload trực tiếp lên Cloudinary, không yêu cầu xác thực.
                        Trang này không hiển thị trong điều hướng và không được
                        index.
                    </Typography.Paragraph>

                    <Card
                        style={{
                            background: "#1e293b",
                            border: "1px solid #334155",
                            color: "#e2e8f0",
                        }}
                        styles={{ body: { padding: 24 } }}
                    >
                        <Space size="middle" wrap>
                            <UploadButton
                                label="Chọn file để upload"
                                maxSizeMB={100}
                                onUploaded={handleUploaded}
                                type="primary"
                                size="large"
                            />
                            <span style={{ color: "#94a3b8", fontSize: 13 }}>
                                Tối đa 100MB · mọi định dạng
                            </span>
                        </Space>
                    </Card>

                    {history.length > 0 && (
                        <Card
                            title={
                                <span style={{ color: "#e2e8f0" }}>
                                    Lịch sử phiên ({history.length})
                                </span>
                            }
                            style={{
                                marginTop: 24,
                                background: "#1e293b",
                                border: "1px solid #334155",
                            }}
                            styles={{
                                header: {
                                    background: "#1e293b",
                                    borderBottom: "1px solid #334155",
                                    color: "#e2e8f0",
                                },
                                body: { padding: 0 },
                            }}
                        >
                            {history.map((item, i) => (
                                <div
                                    key={`${item.publicId}-${item.at}`}
                                    style={{
                                        padding: "16px 20px",
                                        borderBottom:
                                            i < history.length - 1
                                                ? "1px solid #334155"
                                                : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 8,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <LinkOutlined
                                            style={{ color: "#38bdf8" }}
                                        />
                                        <span
                                            style={{
                                                color: "#e2e8f0",
                                                fontWeight: 600,
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            {item.originalFilename}
                                            {item.format
                                                ? `.${item.format}`
                                                : ""}
                                        </span>
                                        <Tag color="blue">
                                            {item.resourceType}
                                        </Tag>
                                        {item.bytes && (
                                            <Tag color="default">
                                                {formatBytes(item.bytes)}
                                            </Tag>
                                        )}
                                    </div>
                                    <Input.Group compact>
                                        <Input
                                            value={item.url}
                                            readOnly
                                            onFocus={(e) => e.target.select()}
                                            style={{
                                                width: "calc(100% - 100px)",
                                                background: "#0f172a",
                                                color: "#e2e8f0",
                                                borderColor: "#334155",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => copy(item.url)}
                                            style={{
                                                width: 100,
                                                height: 32,
                                                background: "#38bdf8",
                                                color: "#0f172a",
                                                border: "none",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <CopyOutlined /> Copy
                                        </button>
                                    </Input.Group>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>
            </main>
        </>
    );
};

export default Page;
