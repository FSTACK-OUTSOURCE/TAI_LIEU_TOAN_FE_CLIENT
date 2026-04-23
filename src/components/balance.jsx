'use client'
import { useRouter } from 'next/navigation'
import { useAppContext } from "@/appcontext";
import ModalRecharge from './modalRecharge';
import { useState } from 'react';
import { WalletOutlined, PlusOutlined, InboxOutlined, RightOutlined } from '@ant-design/icons';

const Balance = () => {
    const router = useRouter();
    const { appcontext } = useAppContext();
    const [showTopup, setShowTopup] = useState(false);

    if (!appcontext.username) return null;

    const balance = new Intl.NumberFormat('vi-VN').format(appcontext.balance || 0);
    const bought = appcontext.bought || 0;

    return (
        <>
            <div
                style={{
                    marginTop: 12,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 60%, #f39c12 100%)",
                    color: "#fff",
                    boxShadow: "0 8px 20px rgba(192,57,43,0.18)",
                }}
            >
                <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.9, fontSize: 13 }}>
                        <WalletOutlined /> Số dư khả dụng
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: 0.3 }}>
                        {balance} <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.9 }}>đ</span>
                    </div>
                    <button
                        onClick={() => setShowTopup(true)}
                        style={{
                            marginTop: 12,
                            border: "none",
                            background: "#ffffff",
                            color: "#c0392b",
                            fontWeight: 600,
                            fontSize: 14,
                            padding: "8px 16px",
                            borderRadius: 999,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                        }}
                    >
                        <PlusOutlined /> Nạp tiền ngay
                    </button>
                </div>
            </div>

            <div
                onClick={() => router.push(`/bought`, { scroll: false })}
                style={{
                    marginTop: 12,
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)"; }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "#eaf4ff", color: "#1677ff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>
                        <InboxOutlined />
                    </div>
                    <div>
                        <div style={{ fontSize: 13, color: "#8c8c8c" }}>Tài liệu đã mua</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1f1f1f" }}>
                            {bought} <span style={{ fontSize: 13, fontWeight: 400, color: "#8c8c8c" }}>tài liệu</span>
                        </div>
                    </div>
                </div>
                <RightOutlined style={{ color: "#bfbfbf" }} />
            </div>

            <ModalRecharge
                showTopup={showTopup}
                handleOk={() => setShowTopup(false)}
                handleCancel={() => setShowTopup(false)}
            />
        </>
    );
}

export default Balance;
