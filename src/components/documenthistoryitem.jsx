'use client'
import { List, Image, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadDocument, formatDateTime } from "@/constants/client";
import { useRouter } from 'next/navigation'


const DocumentHistoryItem = ({ props }) => {
    const { documents } = props
    const router = useRouter();



    return (
        <List
            size="large"
            bordered
            pagination={{
                pageSize: 10,
                locale: { items_per_page: "tài liệu / trang" }
            }}
            dataSource={documents}
            renderItem={(item) => <List.Item actions={[<div>{formatDateTime(new Date(item.CREATED_DATE))}</div>,
            item.IS_FOLDER ? <></> : <Button style={{ marginLeft: 3, backgroundColor: '#5ab5ff' }} type="primary" icon={<DownloadOutlined />} size={'middle'} onClick={() => {
                downloadDocument(item)
            }}>
                Đã mua
            </Button>]}>
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
                    title={<Button className="customLink font12pt boxDocument" style={{ border: 'none', background: 'none', whiteSpace: 'normal', textAlign: 'left' }} title={item.NAME} onClick={() => {
                        if (item.PRICE) {
                            window.open(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, "_blank");
                        }
                        else {
                            router.push(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
                        }
                    }}>
                        <div dangerouslySetInnerHTML={{ __html: item.NAME }} />
                    </Button>}
                />
            </List.Item>}
        />

    );
}

export default DocumentHistoryItem;