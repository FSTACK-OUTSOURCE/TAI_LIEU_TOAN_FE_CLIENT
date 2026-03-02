"use client"
import React from "react";
import { List } from 'antd';
import { formatDateTime } from "@/constants/client";

const TransactionItem = ({ props }) => {
    const { transactions } = props
    return (
        <List
            size="large"
            bordered
            pagination={{
                pageSize: 10,
                locale: { items_per_page: "tài liệu / trang" }
            }}
            dataSource={transactions}
            renderItem={(item) =>
                <List.Item>
                    <List.Item.Meta
                        title={item.AMOUNT > 0 ? `+${new Intl.NumberFormat('vi-VN').format(item.AMOUNT)}` : new Intl.NumberFormat('vi-VN').format(item.AMOUNT)}
                        description={formatDateTime(new Date(item.CREATED_DATE))}
                    />{item.REASON}
                </List.Item>
            }
        />
    );
}

export default TransactionItem;