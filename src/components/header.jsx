"use client"
import React, { useMemo } from "react";
import { useEffect } from 'react';
import { Image } from 'antd';
import { getConfig } from "@/constants/server";
import Login from '@/components/login';
import { useAppContext } from "@/appcontext";
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from 'antd';
import { DollarOutlined } from "@ant-design/icons";

const { Search } = Input;

const Header = ({ props }) => {
    const { configs, userInfo } = props
    const searchParams = useSearchParams()
    const keyword = useMemo(()=>searchParams.get('keyword'), [searchParams])
    const router = useRouter();
    const { appcontext, setAppContext } = useAppContext();

    const handleSearch = (value) => {
        router.push(`/search?keyword=${value}`, { scroll: false })
    }

    useEffect(() => {
        if (Object.keys(appcontext).length == 0) {
            setAppContext({ configs, ...userInfo });
        }
    }, [appcontext]);
    return (
        <nav className="navbar navbar-expand-md navbar-main homeNav">
            <div className="logoPage">
                <Image
                    // src={`${process.env.NEXT_PUBLIC_API_URL}${getConfig({ configs, name: 'logo' })}`}
                    src="/logo.png"
                    alt="Ảnh bị ẩn do mạng"
                    className='img-fluid link-danger'
                    onClick={() => {
                        router.push(`/`, { scroll: false })
                    }}
                    style={{ cursor: 'pointer', width:"200px" }}
                    preview={false}
                />
            </div>
            <Search placeholder="Tìm kiếm tài liệu tại đây..." onSearch={handleSearch} style={{ width: "30%" }} defaultValue={keyword} />

            <div className="" style={{display:"flex", alignItems:"center", gap:"10px"}}>
                <div className="" style={{display:"flex", alignItems:"center", gap:"8px"}}>
                    <div style={{display:"flex", alignItems:"center", gap:"0px"}}>
                        <DollarOutlined style={{marginRight:"8px"}}/>
                        <p style={{margin:0, fontWeight:"bold"}}>Số dư:</p>
                    </div>
                    <p style={{margin:0, fontWeight:"bold"}}>{appcontext?.balance || 0}</p>
                </div>
                <Login />
            </div>
        </nav>
    );
}

export default Header;