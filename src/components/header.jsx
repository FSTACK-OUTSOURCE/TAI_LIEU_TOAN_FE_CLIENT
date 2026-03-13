"use client"
import { useAppContext } from "@/appcontext";
import Login from '@/components/login';
import { DollarOutlined } from "@ant-design/icons";
import { Image, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from "react";

const { Search } = Input;

const Header = ({ props }) => {
    const { configs, userInfo } = props
    const searchParams = useSearchParams()
    const keyword = useMemo(()=>searchParams.get('keyword'), [searchParams])
    const router = useRouter();
    const { appcontext, setAppContext } = useAppContext();

    const handleSearch = (value) => {
        router.push(`/search?keyword=${value}`, { scroll: false })
    }

    useEffect(() => {
        if (Object.keys(appcontext).length == 0) {
            setAppContext({ configs, ...userInfo });
        }
    }, [appcontext]);
    return (
        <nav className="navbar navbar-expand-md navbar-main homeNav">
            <div className="logoPage d-flex align-items-center">
                <Image
                    // src={`${process.env.NEXT_PUBLIC_API_URL}${getConfig({ configs, name: 'logo' })}`}
                    src="/logo.png"
                    alt="Tài liệu toán.vn"
                    className='img-fluid link-danger'
                    onClick={() => {
                        router.push(`/`, { scroll: false })
                    }}
                    style={{ cursor: 'pointer', width:"200px" }}
                    preview={false}
                />
                <Search
                    placeholder="Tìm kiếm tài liệu tại đây..."
                    onSearch={handleSearch}
                    style={{ width: "600px" }}
                    defaultValue={keyword}
                />
            </div>
            <div className="" style={{display:"flex", alignItems:"center", gap:"10px"}}>
                {/* <div className="" style={{display:"flex", alignItems:"center", gap:"8px"}}>
                    <div style={{display:"flex", alignItems:"center", gap:"0px"}}>
                        <DollarOutlined style={{marginRight:"8px"}}/>
                        <p style={{margin:0, fontWeight:"bold"}}>Số dư:</p>
                    </div>
                    <p style={{margin:0, fontWeight:"bold"}}>{appcontext?.balance || 0}</p>
                </div> */}
                <Login />
            </div>
        </nav>
    );
}

export default Header;