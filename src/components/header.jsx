"use client"
import React from "react";
import { useEffect } from 'react';
import { Image } from 'antd';
import { getConfig } from "@/constants/server";
import Login from '@/components/login';
import { useAppContext } from "@/appcontext";
import { useRouter } from 'next/navigation'

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
            <div className="searchHome w-100">
                <form className="navbarForm">
                    <input className="form-control" type="search" placeholder="Tìm kiếm tài liệu tại đây..."></input>
                    <button type="submit" className="buttonSearch">Tìm kiếm</button>
                </form>
                <a href='#' className="customLink" onClick={() => {
                    router.push(`/`, { scroll: false })
                }}>
                    Trang chủ
                </a>
                <a href='#' className="customLink">
                    Tài liệu miễn phí
                </a>
                <a href="#" className="customLink">
                    Hướng dẫn
                </a>
                <Login />
            </div>
        </nav>
    );
}

export default Header;