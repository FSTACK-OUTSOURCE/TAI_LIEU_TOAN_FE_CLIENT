"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { HomeOutlined , InfoCircleOutlined, FileOutlined, PhoneOutlined } from "@ant-design/icons";
import { AdminPhoneNumber } from "@/constants/dataCommon";

const Sidebar = () => {
    const router = useRouter();

    const textStyles ={
        color: "#ffffff",
        fontWeight: 400,
        fontSize: "14px",
        marginBottom: "0px",
    }

    return (
        <div style={{
            paddingRight:"20px",
            height:"42px",
            width:"100%",
            display:"flex",
            alignItems:"center",
            justifyContent:"end",
            gap:"20px",
            background: "#0074a6",
        }}>
            <FormCommon action={() => {
                router.push(`/`, { scroll: false })
            }}>
                <HomeOutlined style={{
                    color:"#fff"
                }}/>
            <p style={textStyles} >
                Trang chủ
            </p>
            </FormCommon>
            <FormCommon>
                <FileOutlined style={{
                    color:"#fff"
                }}/>
                <p style={textStyles}>Tài liệu miễn phí</p>
            </FormCommon>
            <FormCommon>
               <InfoCircleOutlined style={{
                    color:"#fff"
                }}/>
                <p style={textStyles}> Hướng dẫn</p>
            </FormCommon>
            <FormCommon>
                <PhoneOutlined style={{
                    color:"#fff"
                }}/>
                <p style={textStyles}>{AdminPhoneNumber}</p>
            </FormCommon>
        </div>
    );
}

export default Sidebar;

const FormCommon = ({children, action}) =>{
    return <div style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        gap:"8px",
        cursor:"pointer",
    }} onClick={action}>{children}</div>
}