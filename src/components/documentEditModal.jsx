"use client";

import { CloseOutlined, ExportOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const DocumentEditModal = ({ title = "Chỉnh sửa tài liệu", url, onClose }) => {
    useEffect(() => {
        if (!url) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [url]);

    if (!url) return null;

    return (
        <div className="document-edit-modal" role="dialog" aria-modal="true">
            <div className="document-edit-modal__header">
                <div className="document-edit-modal__title">{title}</div>
                <div className="document-edit-modal__actions">
                    <a
                        className="document-edit-modal__icon-btn"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Mở tab mới"
                    >
                        <ExportOutlined />
                    </a>
                    <button
                        className="document-edit-modal__icon-btn"
                        type="button"
                        onClick={onClose}
                        title="Đóng"
                    >
                        <CloseOutlined />
                    </button>
                </div>
            </div>
            <iframe
                className="document-edit-modal__iframe"
                src={url}
                title={title}
            />
            <style jsx global>{`
                .document-edit-modal {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                }
                .document-edit-modal__header {
                    height: 52px;
                    flex: 0 0 52px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 0 16px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #ffffff;
                }
                .document-edit-modal__title {
                    min-width: 0;
                    font-size: 15px;
                    font-weight: 600;
                    color: #1f2937;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .document-edit-modal__actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-shrink: 0;
                }
                .document-edit-modal__icon-btn {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: #ffffff;
                    color: #374151;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-decoration: none;
                }
                .document-edit-modal__icon-btn:hover {
                    background: #f3f4f6;
                    color: #111827;
                }
                .document-edit-modal__iframe {
                    flex: 1 1 auto;
                    width: 100%;
                    min-height: 0;
                    border: none;
                    background: #ffffff;
                }
            `}</style>
        </div>
    );
};

export default DocumentEditModal;
