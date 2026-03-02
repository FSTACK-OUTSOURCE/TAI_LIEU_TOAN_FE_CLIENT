'use client'
import { CloseOutlined } from '@ant-design/icons';


const DocumentPreview = ({ props }) => {
    const { documentinfo, onClose } = props
    return (
        <div className="overlay sizePopUp">
            <div className="popupDocument">
                <div className="areaCloseButton">
                    <div className="closeButton">
                        <div className="cursorChange" onClick={() => { onClose() }}>
                            <CloseOutlined />
                        </div>
                    </div>
                </div>
                <div className="boxSideChiTiet">
                    {documentinfo.LINK_PREIVEW ? <iframe src={documentinfo.LINK_PREVIEW} width="800" height="750"></iframe> : <></>}
                </div>
            </div>
        </div>

    );
}

export default DocumentPreview;