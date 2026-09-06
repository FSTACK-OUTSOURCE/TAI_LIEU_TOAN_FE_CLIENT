"use client";
import { useRef, useState } from "react";
import { Button, message } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

const UploadButton = ({
    label = "Upload file",
    accept,
    maxSizeMB = 25,
    onUploaded,
    onError,
    children,
    ...buttonProps
}) => {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handlePick = () => inputRef.current?.click();

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            const msg = `File vượt quá ${maxSizeMB}MB`;
            message.error(msg);
            onError?.(new Error(msg));
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Upload thất bại");
            }
            message.success("Upload thành công");
            onUploaded?.(data);
        } catch (err) {
            message.error(err.message || "Upload thất bại");
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: "none" }}
            />
            <Button
                icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                onClick={handlePick}
                loading={loading}
                disabled={loading}
                {...buttonProps}
            >
                {children || label}
            </Button>
        </>
    );
};

export default UploadButton;
