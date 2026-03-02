'use client'
import { Button } from 'antd';
import { useRouter } from 'next/navigation'


const BreadCrumbItem = ({ props }) => {
    const { item, rootParent } = props
    const router = useRouter();
    return (
        <Button type="text" className="titleColor fw-bold" style={{fontSize: '9pt'}} block onClick={() => {
            router.push(`/${(item.DOCUMENT_ID == rootParent.DOCUMENT_ID ? "" : `${rootParent.NAME_SLUG}/`)}${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
        }}>
            {item.NAME}
        </Button>

    );
}

export default BreadCrumbItem;