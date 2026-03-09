"use client"
import React from "react";
import { Image } from 'antd';
import { getConfig } from "@/constants/server";
import { useAppContext } from "@/appcontext";
import { useEffect, useState } from 'react';

const Footer = () => {
    const { appcontext, setAppContext } = useAppContext();

    const [configs, setConfigs] = useState([]);

    const redirectLink = (link) => {
        window.open(link, '_blank').focus();
    }

    useEffect(() => {
        if (appcontext.configs) {
            setConfigs(appcontext.configs)
        }
    }, [appcontext]);
    return (
        <footer style={{ backgroundColor: '#fdf9ed', padding: '30px 100px' }}>
            <div dangerouslySetInnerHTML={{ __html: getConfig({ configs, name: 'footer' }) }} />

            <div className='pb-5' style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <Image
                    // src={`${process.env.NEXT_PUBLIC_API_URL}${getConfig({ configs, name: 'logo' })}`}
                    src="/logo.png"
                    alt="Tài liệu toán.vn"
                    className='img-fluid link-danger'
                    onClick={() => {
                        router.push(`/`, { scroll: false })
                    }}
                    style={{ cursor: 'pointer', width:"250px" }}
                    preview={false}
                />
                <span>
                    <Image
                        src="/zaloimg.png"
                        alt="Tài liệu toán.vn"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer', objectFit:"contain" }}
                        onClick={() => {
                            redirectLink(getConfig({ configs, name: 'zalo' }))
                        }}
                    />
                    <Image
                        src="/kythuatimg.png"
                        alt="Tài liệu toán.vn"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer', objectFit:"contain" }}
                        onClick={() => {
                            redirectLink(getConfig({ configs, name: 'zalo' }))
                        }}
                    />
                    <Image
                        src="/facebook.png"
                        alt="Tài liệu toán.vn"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer', objectFit:"contain" }}
                        onClick={() => {
                            redirectLink(getConfig({ configs, name: 'facebook' }))
                        }}
                    />
                </span>
            </div>
        </footer>
    );
}

export default Footer;