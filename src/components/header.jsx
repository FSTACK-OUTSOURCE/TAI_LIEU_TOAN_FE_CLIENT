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
            className="navbar navbar-expand-md navbar-main homeNav"
            style={{
                background: "#ffffff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "12px 32px",
                gap: 16,
                flexWrap: "wrap",
            }}
        >
            <div
                className="logoPage d-flex align-items-center"
                style={{ gap: 20, flex: "1 1 auto", minWidth: 280 }}
            >
                <Image
                    src="/logo.png"
                    alt="Tài liệu toán.vn"
                    className='img-fluid'
                    onClick={() => router.push(`/`, { scroll: false })}
                    style={{ cursor: 'pointer', width: 200, flexShrink: 0 }}
                    preview={false}
                />
                <Search
                    placeholder="Tìm kiếm tài liệu, đề thi, chuyên đề..."
                    onSearch={handleSearch}
                    enterButton
                    allowClear
                    size="large"
                    style={{ maxWidth: 600, flex: "1 1 auto" }}
                    defaultValue={keyword}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Login />
            </div>
        </nav>
    );
}

export default Header;
