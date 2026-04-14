"use client"
import React from "react";
import { useState } from "react";
import { Dropdown, Image, Menu, Row, Col, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'

export default function Category({ props }) {
    const { categories } = props
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const gridContent = (
        <div style={{ padding: 20, width: 1000, background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <Row gutter={[16, 16]}>
                {categories.filter(x => x.IS_FOLDER).map((category, index) => (
                    <Col span={6} key={index}>
                        <div style={{ display: 'flex' }}>
                            <span>
                                <Image
                                    preview={false}
                                    src={"/folder.png"}
                                    alt="Tài liệu toán.vn"
                                    className='img-fluid'
                                    width={20}
                                    height={20}
                                />
                            </span>
                            <span style={{ paddingTop: 2, paddingLeft: 10, cursor: 'pointer' }} className="gridItem" onClick={() => {
                                router.push(`/${category.NAME_SLUG}-${category.IDENTITY_KEY}`, { scroll: false })
                            }}>
                                {category.NAME}
                            </span>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );

    const menuItems = [
        {
            key: 'danh-muc',
            style: { height: '42px', fontWeight: 'bold', fontSize: 16, backgroundColor: '#fdcd02', borderRadius: '0px', margin: '0px' },
            label: (
                <Dropdown
                    dropdownRender={() => gridContent}
                    trigger={['click']}
                    placement="bottomLeft"
                    open={visible}
                    onOpenChange={(flag) => setVisible(flag)}
                >
                    <Space style={{ color: '#000000' }}>
                        <MenuOutlined /> DANH MỤC TÀI LIỆU
                    </Space>
                </Dropdown>
            ),
        },
    ];

    return (
        <Menu mode="inline" items={menuItems} />
    );
}