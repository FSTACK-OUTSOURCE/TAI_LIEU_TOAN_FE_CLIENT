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
        <footer style={{ backgroundColor: '#fdf9ed', padding: '30px' }}>
            <div dangerouslySetInnerHTML={{ __html: getConfig({ configs, name: 'footer' }) }} />

            <div className='pb-5'>
                <span>
                    <Image
                        src="/zaloimg.png"
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            redirectLink(getConfig({ configs, name: 'zalo' }))
                        }}
                    />
                    <Image
                        src="/kythuatimg.png"
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            redirectLink(getConfig({ configs, name: 'zalo' }))
                        }}
                    />
                    <Image
                        src="/facebook.png"
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        preview={false}
                        width={150}
                        height={50}
                        style={{ cursor: 'pointer' }}
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