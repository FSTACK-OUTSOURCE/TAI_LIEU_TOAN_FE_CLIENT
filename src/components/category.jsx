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
    const folderCategories = categories.filter(x => x.IS_FOLDER);
    const gridContent = (
        <div className="category-dropdown" style={{ background: '#fff', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)', borderRadius: 6 }}>
            <Row gutter={[12, 12]}>
                {folderCategories.map((category, index) => (
                    <Col xs={12} sm={12} md={8} lg={6} key={index}>
                        <div
                            className="gridItem category-item"
                            onClick={() => {
                                setVisible(false);
                                router.push(`/${category.NAME_SLUG}-${category.IDENTITY_KEY}`, { scroll: false })
                            }}
                        >
                            <Image
                                preview={false}
                                src={"/folder.png"}
                                alt="Danh mục"
                                width={20}
                                height={20}
                            />
                            <span className="category-item__name">{category.NAME}</span>
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
                    overlayClassName="category-dropdown-overlay"
                >
                    <Space style={{ color: '#000000' }}>
                        <MenuOutlined /> DANH MỤC TÀI LIỆU
                    </Space>
                </Dropdown>
            ),
        },
    ];

    return (
        <>
            <Menu mode="inline" items={menuItems} />
            <style jsx global>{`
                .category-dropdown {
                    padding: 16px;
                    width: 1000px;
                    max-width: calc(100vw - 24px);
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .category-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .category-item__name {
                    font-size: 14px;
                    line-height: 1.35;
                    flex: 1;
                    min-width: 0;
                    word-break: break-word;
                }
                @media (max-width: 992px) {
                    .category-dropdown { width: calc(100vw - 24px); padding: 12px; }
                }
                @media (max-width: 768px) {
                    .category-dropdown-overlay { left: 12px !important; right: 12px !important; }
                    .category-item { padding: 8px 10px; }
                    .category-item__name { font-size: 13px; }
                }
            `}</style>
        </>
    );
}