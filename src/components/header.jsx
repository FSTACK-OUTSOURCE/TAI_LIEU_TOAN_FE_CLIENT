"use client"
import React from "react";
import { useEffect } from 'react';
import { Image } from 'antd';
import { getConfig } from "@/constants/server";
import Login from '@/components/login';
import { useAppContext } from "@/appcontext";
import { useRouter } from 'next/navigation'
import { Input, Space } from 'antd';
const { Search } = Input;

const Header = ({ props }) => {
    const { configs, userInfo } = props
    const router = useRouter();
    const { appcontext, setAppContext } = useAppContext();

    useEffect(() => {
        if (Object.keys(appcontext).length == 0) {
            setAppContext({ configs, ...userInfo });
        }
    }, [appcontext]);
    return (
        <nav className="navbar navbar-expand-md navbar-main homeNav">
            <div className="logoPage">
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${getConfig({ configs, name: 'logo' })}`}
                    alt="Ảnh bị ẩn do mạng"
                    className='img-fluid link-danger'
                    onClick={() => {
                        router.push(`/`, { scroll: false })
                    }}
                    style={{ cursor: 'pointer' }}
                    preview={false}
                />
            </div>
            <Search placeholder="Tìm kiếm tài liệu tại đây..." onSearch={()=>{}} style={{ width: "50%" }} />
            <Login />
        </nav>
    );
}

export default Header;