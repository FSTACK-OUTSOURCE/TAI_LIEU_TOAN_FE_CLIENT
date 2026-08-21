'use client'
import Swal from "sweetalert2";
import axios from "axios";

export const guidEmpty = "00000000-0000-0000-0000-000000000000";

export const formatDateTime = (date) => {
    const formattedDate = date.toLocaleDateString('vi-VN'); // 'dd/MM/yyyy'
    const formattedTime = date.toLocaleTimeString('vi-VN', { hour12: false }); // 'HH:mm:ss' (24-hour format)
    return `${formattedDate} ${formattedTime}`;
}



export const checkSignIn = async () => {
    var result = await Swal.fire({
        title: 'Vui lòng đăng nhập',
        html: `<div id="google-login-button" style="display: flex; justify-content: center; height: 50px"></div>`,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Đóng",
        didOpen: () => {
            setTimeout(() => {
                const container = document.getElementById("google-login-button");
                if (container) {
                    window.google.accounts.id.renderButton(container, { theme: "filled_blue", width: "300px", size: "large", shape: "square", locale: "vi" });
                }
            }, 100);
        },
    });
    if (!result.isConfirmed) {
        return { success: false }
    }
}

export const downloadFile = async (fileUrl, fileName) => {
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
        const response = await axios.get(fileUrl);
        await Swal.fire({
            title: 'Thông báo',
            text: "Mua tài liệu thành công",
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500
        })
        if (response.data.Url) {
            const link = document.createElement('a');
            link.href = response.data.Url;
            link.download = `${fileName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        Swal.close();
    }
}

export const handleBadRequest = async (error) => {
    const errorBlob = error.response.data;
    const errorText = await errorBlob.text();
    const errorData = JSON.parse(errorText);
    var message = errorData.errors.join('<br/>')
    Swal.fire({
        title: 'Thông báo',
        html: message,
        icon: 'warning'
    });
}

export const signInGoogle = async (idToken) => {

    try {
        var response = await axios.get('/api/identity', {
            params: {
                idtoken: idToken
            }
        })
        await Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập thành công',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500
        })
        return { success: true, userinfo: response.data }
    } catch (error) {
        await Swal.fire({
            title: 'Thông báo',
            text: 'Đăng nhập thất bại',
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: true
        })
        return { success: false }
    }
}

export const downloadDocument = async (item, onClose) => {
    try {
        var apiUrl = `/api/buy?documentid=${item.DOCUMENT_ID}`;
        await downloadFile(apiUrl, `${item.NAME}${item.FILE_EXTENSION}`)
        Swal.close();
        if (typeof onClose === 'function') {
            onClose();
        }
        var downloaded = localStorage.getItem('downloaded');


        if (!downloaded) {
            localStorage.setItem('downloaded', JSON.stringify([item.DOCUMENT_ID]));
        }
        else {
            var downloadedArray = JSON.parse(downloaded);

            if (!downloadedArray.includes(item.DOCUMENT_ID)) {
                downloadedArray.push(item.DOCUMENT_ID);
                localStorage.setItem('downloaded', JSON.stringify(downloadedArray));
            }
        }


        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.log(error)
        await handleBadRequest(error)
    }
}
