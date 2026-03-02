'use client'
import { Image } from 'antd';
import { useRouter } from 'next/navigation'


const FolderItem = ({ props }) => {
    const { folder } = props
    const router = useRouter();
    return (
        <div className="parent-category widthFullContent font14 boxSizeTaiLieu col-lg-3 col-xl-3">
            <span>
                <Image
                    src="/folder.png"
                    alt="Ảnh bị ẩn do mạng"
                    preview={false}
                    className='img-fluid'
                    width={40}
                    height={25}
                    style={{ paddingRight: 10 }}
                />
                <label className="fontBold cursorChange titleColor" onClick={() => {
                    router.push(`/${folder.NAME_SLUG}-${folder.IDENTITY_KEY}`, { scroll: false })
                }}>{folder.NAME}</label>
            </span>
        </div>

    );
}

export default FolderItem;