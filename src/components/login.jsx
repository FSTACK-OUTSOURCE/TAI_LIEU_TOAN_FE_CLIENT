"use client"
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Input, Select, Card, Divider } from "antd";
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { useAppContext } from "@/appcontext";
import axios from "axios";
import { checkSignIn, signInGoogle } from "@/constants/client"
import { LogoutOutlined } from "@ant-design/icons";


const Login = () => {

    const { appcontext, setAppContext } = useAppContext();
    const router = useRouter();
    const googleSignInRef = useRef(null);
    const [isGoogleButtonRendered, setIsGoogleButtonRendered] = useState(false);

    const items = [
        {
            key:"5",
            label:<button style={{ border: 'none', background: 'none', color: 'black' }}>{appcontext?.username || ""}</button>
        },
        {
            key:"6",
            label:<Divider style={{margin:"0px"}}/>
        },
        {
            key: '2',
            label: (
                <button style={{ border: 'none', background: 'none', color: 'black' }} className="customLink" onClick={() => {
                    router.push(`/bought`, { scroll: false })
                }}>
                    Tài liệu đã mua
                </button>
            ),
        },
        {
            key: '3',
            label: (
                <button style={{ border: 'none', background: 'none', color: 'black' }} className="customLink" onClick={() => {
                    router.push(`/transaction`, { scroll: false })
                }}>
                    Lịch sử giao dịch
                </button>
            ),
        },
        {
            label: (<button style={{ border: 'none', background: 'none', color: 'black' }} onClick={async () => {

                try {
                    await axios.get('/api/logout');
                    setAppContext({ configs: appcontext.configs })
                    await Swal.fire({
                        title: 'Thông báo',
                        text: "Đăng xuất thành công",
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        timer: 1500
                    })

                    window.location.reload();
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        title: 'Thông báo',
                        text: "Đăng xuất thất bại",
                        icon: 'error',
                        allowOutsideClick: false
                    })
                }
            }} className="customLink"><LogoutOutlined style={{marginRight:"8px"}}/> Đăng xuất</button>),
            key: '4',
        },
    ];
    const onFinish = async (values) => {
        Swal.fire({
            title: 'Vui lòng đợi...',
            text: 'Yêu cầu của bạn đang được thực hiện',
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            await axios.post('/api/identity', {
                PHONE_NUMBER: values.phonenumber,
                JOB: values.job,
                LEVEL: values.level,
            })
            setAppContext({ ...appcontext, phonenumber: values.phonenumber })
        }
        catch {
            await Swal.fire({
                title: 'Thông báo',
                text: 'Cập nhật thất bại! Thử lại sau',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: false,
                timer: 1500
            })
        }
        finally {
            Swal.close()
        }
    };
    const phoneNumberRegex = /^0(3|5|7|8|9)\d{8}$/;

    useEffect(() => {
        if (appcontext.username) {
            return;
        }

        if (!document.getElementById("google-script")) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.id = "google-script";
            script.async = true;
            script.defer = true;
            script.onload = () => initializeGoogleLogin(); // Initialize after script loads
            document.body.appendChild(script);
        } else {
            initializeGoogleLogin();
        }
    }, [appcontext.username]);

    const initializeGoogleLogin = () => {
        if (window.google && window.google.accounts && googleSignInRef.current) {

            // Load Google Identity Services SDK
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Replace with your actual Client ID
                callback: handleCredentialResponse
            });

            // Render the Google Sign-In button
            window.google.accounts.id.renderButton(
                googleSignInRef.current,
                { theme: "filled_blue", size: "large", shape: "square", locale: "vi" }
            );
            requestAnimationFrame(() => {
                setIsGoogleButtonRendered(Boolean(googleSignInRef.current?.children?.length));
            });
        }
    };


    // Callback function when user logs in
    const handleCredentialResponse = async (response) => {
        var data = await signInGoogle(response.credential)

        if (data.success) {
            setAppContext({ ...appcontext, ...data.userinfo })
            window.location.reload();
        }

    };
    return (
        <section>
            {
                false ?
                    <div className="overlay">
                        <div className="popupTopup login-complete-popup">
                            <Card title="Hoàn tất thông tin" style={{ textAlign: 'center', fontSize: '20px' }} >
                                <Form
                                    name="basic"
                                    labelCol={{
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 16,
                                    }}
                                    style={{
                                        maxWidth: 600,
                                    }}
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Họ và tên:"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Số điện thoại:"
                                        name="phonenumber"
                                        extra="Vui lòng nhập chính xác để được hỗ trợ."
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số điện thoại!',
                                            },
                                            {
                                                pattern: phoneNumberRegex,
                                                message: 'Số điện thoại không đúng định dạng!',
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="job" label="Bạn là:"
                                        rules={[{
                                            required: true,
                                            message: 'Vui lòng chọn thông tin này!',
                                        }]}
                                    >
                                        <Select placeholder="-- Lựa chọn --">
                                            <Select.Option value="gv">Giáo viên - Giảng viên - Gia sư</Select.Option>
                                            <Select.Option value="hs">Học sinh - Sinh viên</Select.Option>
                                            <Select.Option value="ph">Phụ huynh</Select.Option>
                                            <Select.Option value="k">Khác</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="level" label="Cấp học:"
                                        rules={[{
                                            required: true,
                                            message: 'Vui lòng chọn thông tin này!',
                                        }]}
                                    >
                                        <Select placeholder="-- Lựa chọn --">
                                            <Select.Option value="th">Tiểu học</Select.Option>
                                            <Select.Option value="cs">THCS</Select.Option>
                                            <Select.Option value="pt">THPT</Select.Option>
                                            <Select.Option value="dh">Đại học</Select.Option>
                                            <Select.Option value="ch">Cao học</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="subject" label="Môn học:">
                                        <Select placeholder="-- Lựa chọn --" allowClear>
                                            <Select.Option value="toan">Toán</Select.Option>
                                            <Select.Option value="van">Ngữ văn</Select.Option>
                                            <Select.Option value="anh">Tiếng Anh</Select.Option>
                                            <Select.Option value="ly">Vật lý</Select.Option>
                                            <Select.Option value="hoa">Hóa học</Select.Option>
                                            <Select.Option value="sinh">Sinh học</Select.Option>
                                            <Select.Option value="su">Lịch sử</Select.Option>
                                            <Select.Option value="dia">Địa lý</Select.Option>
                                            <Select.Option value="tin">Tin học</Select.Option>
                                            <Select.Option value="khac">Khác</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label={null}>
                                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                            Hoàn tất
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>

                        </div>
                    </div> : <></>
            }
            {
                appcontext.username ? <Dropdown
                placement="bottomCenter"
                    menu={{
                        items
                    }}
                >
                    <Button className="btn btn-login-v2 btn-danger btn-auth-home"
                        style={{
                            borderRadius: "100%",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }} size='large' onClick={(e) => e.preventDefault()}>{appcontext.username.charAt(0)}</Button>
                </Dropdown> :
                    <div className="login-google-container">
                        <div ref={googleSignInRef}></div>
                        {!isGoogleButtonRendered ? (
                            <Button
                                className="btn btn-login-v2 btn-danger btn-auth-home"
                                onClick={() => checkSignIn()}
                            >
                                Đăng nhập
                            </Button>
                        ) : null}
                    </div>
            }
        </section>
    )
}

export default Login
