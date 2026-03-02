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
                                    alt="Ảnh bị ẩn do mạng"
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

    return (
        <div className="row">
            <div className="col-md-12">
                <div style={{ display: 'flex' }}>
                    <Menu mode="inline" style={{ width: 256 }}>
                        <Menu.Item key="danh-muc" style={{ fontWeight: 'bold', fontSize: 16, backgroundColor: '#fdcd02' }}>
                            <Dropdown
                                overlay={gridContent}
                                trigger={['click']}
                                placement="bottomLeft" // Adjusts the placement of the popup
                                open={visible}
                                onOpenChange={(flag) => setVisible(flag)}
                            >
                                <Space style={{ color: '#1677ff' }}>
                                    <MenuOutlined /> DANH MỤC TÀI LIỆU
                                </Space>
                            </Dropdown>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        </div>
    );
}