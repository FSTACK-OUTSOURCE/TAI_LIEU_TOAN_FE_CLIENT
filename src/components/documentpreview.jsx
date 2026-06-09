"use client";
import { normalizePreviewUrl } from "@/constants/preview";
import { CloseOutlined } from "@ant-design/icons";

const DocumentPreview = ({ props }) => {
    const { documentinfo, onClose } = props;
    const previewUrl = normalizePreviewUrl(documentinfo.LINK_PREVIEW);

    return (
        <div className="overlay sizePopUp">
            <div className="popupDocument">
                <div className="areaCloseButton">
                    <div className="closeButton">
                        <div
                            className="cursorChange"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <CloseOutlined />
                        </div>
                    </div>
                </div>
                <div className="boxSideChiTiet">
                    {previewUrl ? (
                        <iframe src={previewUrl} width="800" height="750" />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentPreview;
