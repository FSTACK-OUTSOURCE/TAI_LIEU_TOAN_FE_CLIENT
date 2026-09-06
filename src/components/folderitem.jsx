'use client'
import { Image } from 'antd';
import { useRouter } from 'next/navigation'


const FolderItem = ({ props }) => {
    const { folder } = props
    const router = useRouter();
    return (
        <div className="folder-item col-6 col-md-4 col-lg-3">
            <div
                className="folder-item__inner cursorChange"
                onClick={() => {
                    router.push(`/${folder.NAME_SLUG}-${folder.IDENTITY_KEY}`, { scroll: false })
                }}
            >
                <Image
                    src="/folder.png"
                    alt="Danh mục"
                    preview={false}
                    width={28}
                    height={20}
                    style={{ flexShrink: 0 }}
                />
                <span className="fontBold titleColor folder-item__name">{folder.NAME}</span>
            </div>
            <style jsx global>{`
                .folder-item {
                    padding: 6px;
                }
                .folder-item__inner {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 10px;
                    background: #fff;
                    border: 1px solid #f0e6d2;
                    border-radius: 6px;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    min-height: 44px;
                }
                .folder-item__inner:hover {
                    border-color: #fdcd02;
                    box-shadow: 0 2px 6px rgba(253, 205, 2, 0.2);
                }
                .folder-item__name {
                    font-size: 13px;
                    line-height: 1.3;
                    word-break: break-word;
                    flex: 1;
                    min-width: 0;
                }
                @media (max-width: 480px) {
                    .folder-item__name { font-size: 12px; }
                }
            `}</style>
        </div>
    );
}

export default FolderItem;