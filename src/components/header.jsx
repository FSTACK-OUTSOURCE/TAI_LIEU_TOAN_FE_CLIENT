"use client";
import { useAppContext } from "@/appcontext";
import Login from "@/components/login";
import ModalRecharge from "@/components/modalRecharge";
import { Image, Input, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WalletOutlined, PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const Header = ({ props }) => {
    const { configs, userInfo } = props;
    const searchParams = useSearchParams();
    const keyword = useMemo(() => searchParams.get("keyword"), [searchParams]);
    const router = useRouter();
    const { appcontext, setAppContext } = useAppContext();
    const [showTopup, setShowTopup] = useState(false);
    const balance = appcontext.balance ? new Intl.NumberFormat("vi-VN").format(appcontext.balance) : "0";

    const handleSearch = (value) => {
        const v = (value || "").trim();
        if (!v) return;
        router.push(`/search?keyword=${encodeURIComponent(v)}`, {
            scroll: false,
        });
    };

    useEffect(() => {
        if (Object.keys(appcontext).length == 0) {
            setAppContext({ configs, ...userInfo });
        }
    }, [appcontext]);

    return (
        <nav
            className="navbar navbar-expand-md navbar-main homeNav header-root"
            style={{
                background: "#ffffff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "12px 32px",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            <Image
                src="/logo.png"
                alt="Tài liệu toán.vn"
                className="img-fluid header-logo"
                onClick={() => router.push(`/`, { scroll: false })}
                style={{ cursor: "pointer", width: 200, flexShrink: 0 }}
                preview={false}
            />
            <Search
                className="header-search"
                placeholder="Tìm kiếm tài liệu, đề thi, chuyên đề..."
                onSearch={handleSearch}
                enterButton
                allowClear
                size="large"
                style={{ maxWidth: 550, flex: "1 1 auto" }}
                defaultValue={keyword}
            />
            {!appcontext.username && (
                <div className="header-balance">
                    <div className="balance-display">
                        <WalletOutlined style={{ marginRight: 4 }} />
                        <span>{balance}đ</span>
                    </div>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setShowTopup(true)}
                        className="btn-topup"
                    >
                        Nạp tiền
                    </Button>
                </div>
            )}
            <div className="header-login">
                <Login />
            </div>
            <ModalRecharge
                showTopup={showTopup}
                handleOk={() => setShowTopup(false)}
                handleCancel={() => setShowTopup(false)}
            />
            <style jsx global>{`
                .header-balance {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    background: transparent;
                    border-radius: 6px;
                    flex: 0 0 auto;
                }
                .balance-display {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #1677ff;
                }
                .btn-topup {
                    border-radius: 20px !important;
                    font-weight: 700 !important;
                    color: #ff6a00 !important;
                    background: #ffffff !important;
                    border: 1.5px solid #ff6a00 !important;
                    padding: 6px 16px !important;
                    box-shadow: none !important;
                    height: auto !important;
                }
                .header-login {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    min-width: 128px;
                    flex: 0 0 auto;
                }
                .login-google-container {
                    min-width: 128px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 992px) {
                    .header-balance {
                        padding: 4px 10px;
                        gap: 6px;
                    }
                    .balance-display {
                        font-size: 0.85rem;
                    }
                    .btn-topup {
                        padding: 5px 12px !important;
                        font-size: 0.9rem !important;
                        height: 32px !important;
                    }
                }
                @media (max-width: 768px) {
                    .header-root {
                        padding: 10px 12px !important;
                        gap: 10px !important;
                        flex-wrap: wrap;
                        position: relative;
                    }
                    .header-logo {
                        width: 140px !important;
                        order: 1;
                    }
                    .header-search {
                        width: calc(100% - 50px) !important;
                        flex: 0 1 auto !important;
                        max-width: 100% !important;
                        order: 2;
                    }
                    .header-login {
                        display: flex;
                        position: absolute;
                        right: 12px;
                        top: 10px;
                        min-width: auto;
                        order: 0;
                    }
                    .header-balance {
                        width: 100%;
                        order: 3;
                        margin-top: 8px;
                        justify-content: space-between;
                        background: linear-gradient(135deg, #fef3e2 0%, #fff7e6 100%);
                        border: 1px solid #ffe7ba;
                        padding: 8px 12px;
                    }
                }
                @media (max-width: 480px) {
                    .header-logo {
                        width: 110px !important;
                    }
                    .balance-display {
                        font-size: 0.8rem;
                    }
                    .btn-topup {
                        padding: 4px 10px !important;
                        font-size: 0.8rem !important;
                        height: 30px !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Header;
