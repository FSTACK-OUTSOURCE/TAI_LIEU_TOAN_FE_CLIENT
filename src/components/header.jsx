"use client"
import { useAppContext } from "@/appcontext";
import Login from '@/components/login';
import { Image, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from "react";

const { Search } = Input;

const Header = ({ props }) => {
    const { configs, userInfo } = props
    const searchParams = useSearchParams()
    const keyword = useMemo(() => searchParams.get('keyword'), [searchParams])
    const router = useRouter();
    const { appcontext, setAppContext } = useAppContext();

    const handleSearch = (value) => {
        const v = (value || '').trim();
        if (!v) return;
        router.push(`/search?keyword=${encodeURIComponent(v)}`, { scroll: false })
    }

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
                className='img-fluid header-logo'
                onClick={() => router.push(`/`, { scroll: false })}
                style={{ cursor: 'pointer', width: 200, flexShrink: 0 }}
                preview={false}
            />
            <Search
                className="header-search"
                placeholder="Tìm kiếm tài liệu, đề thi, chuyên đề..."
                onSearch={handleSearch}
                enterButton
                allowClear
                size="large"
                style={{ maxWidth: 600, flex: "1 1 auto" }}
                defaultValue={keyword}
            />
            <div className="header-login">
                <Login />
            </div>
            <style jsx global>{`
                .header-login { display: flex; align-items: center; flex-shrink: 0; }
                @media (max-width: 768px) {
                    .header-root {
                        padding: 10px 12px !important;
                        gap: 10px !important;
                    }
                    .header-logo { width: 140px !important; }
                    .header-search {
                        width: 100% !important;
                        flex: 1 1 100% !important;
                        max-width: 100% !important;
                        order: 3;
                    }
                    .header-login {
                        order: 2;
                        margin-left: auto;
                    }
                }
                @media (max-width: 480px) {
                    .header-logo { width: 110px !important; }
                }
            `}</style>
        </nav>
    );
}

export default Header;
