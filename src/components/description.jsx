'use client'
import { Button } from 'antd';
import { useState } from "react";

const Description = ({ props }) => {
    const { documentinfo } = props;
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    return (
        documentinfo.DESCRIPTION ? <div className="section-heading mt-3 pt-3 pb-3 mb-3" style={{ backgroundColor: "#fdf9ed" }}>
            <div className="row form-group p-3">
                <div className="col-md-12">
                    <div style={{ padding: '20px' }}>
                        <div style={{ maxHeight: expanded ? 'none' : '80px', overflow: 'hidden', fontSize: '10pt' }}>
                            <div dangerouslySetInnerHTML={{ __html: documentinfo.DESCRIPTION }} />
                        </div>
                        <Button type="primary" onClick={toggleExpand} style={{ marginTop: '10px' }}>
                            {expanded ? 'Ẩn đi' : 'Xem thêm'}
                        </Button>
                    </div>
                </div>
            </div>
        </div> : <div></div>

    );
}

export default Description;