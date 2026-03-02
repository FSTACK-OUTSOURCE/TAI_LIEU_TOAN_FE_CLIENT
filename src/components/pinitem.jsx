"use client"
import React from "react";
import { Image, List } from 'antd';
import { useRouter } from 'next/navigation'

const PinItem = ({ props }) => {
    const router = useRouter();
    const { pin } = props
    return (
        <List
            size="large"
            bordered
            dataSource={pin.documents}
            renderItem={(item) => <List.Item>
                <List.Item.Meta
                    avatar={item.IS_FOLDER ? <Image
                        preview={false}
                        src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/folder.png"}
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        width={50}
                        height={50}
                    /> : <Image
                        preview={false}
                        src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : "/docTaiLieu.png"}
                        alt="Ảnh bị ẩn do mạng"
                        className='img-fluid'
                        width={50}
                        height={50}
                    />}
                    title={<button style={{ border: 'none', background: 'none', textAlign: 'left' }} className="customLink font12pt boxDocument" title={item.NAME} onClick={() => {
                        router.push(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
                    }}>{item.NAME}</button>}
                />
            </List.Item>}
        />

    );
}

export default PinItem;