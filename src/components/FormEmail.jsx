"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "subscription_modal_last_shown";
const COOLDOWN_DAYS = 5;

const LIST_UUIDS = [
  "db72f967-0f46-4a16-b9ea-d9ab85e493ac",
  "268ac909-60ac-4c56-84d8-fb5f3ab0cd4c",
];

export default function SubscriptionModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (!lastShown) { setOpen(true); return; }
    const daysPassed = (Date.now() - parseInt(lastShown, 10)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= COOLDOWN_DAYS) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    const body = new URLSearchParams();
    body.append("email", email);
    body.append("name", name);
    body.append("nonce", "");
    LIST_UUIDS.forEach((uuid) => body.append("l", uuid));

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (res.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } else {
        setStatus("error");
        setErrorMsg(`Lỗi ${res.status}. Vui lòng thử lại.`);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Không thể kết nối. Vui lòng thử lại.");
    }
  };

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: "relative",
          width: "min(420px, 95vw)",
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: "36px 32px 28px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          fontFamily: "inherit",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Đóng"
          style={{
            position: "absolute", top: 12, right: 14,
            background: "none", border: "none",
            fontSize: 20, cursor: "pointer", color: "#888",
          }}
        >✕</button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Đăng ký thành công!</p>
            <p style={{ fontSize: 14, color: "#666" }}>Kiểm tra email để xác nhận đăng ký.</p>
            <button onClick={handleClose} style={{ ...btnStyle, marginTop: 20, padding: "10px 28px", width: "auto" }}>
              Đóng
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>
              Đăng ký nhận thông báo
            </h2>
            <p style={{ margin: "0 0 22px", fontSize: 14, color: "#666" }}>
              Nhận tài liệu và cập nhật mới nhất từ Tài Liệu Toán.
            </p>

            <label style={labelStyle}>Họ tên</label>
            <input
              type="text" placeholder="Nguyễn Văn A"
              value={name} onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Email <span style={{ color: "#e53" }}>*</span></label>
            <input
              type="email" placeholder="ban@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            {status === "error" && (
              <p style={{ color: "#e53", fontSize: 13, margin: "0 0 8px" }}>{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "loading" || !email}
              style={{
                ...btnStyle,
                background: status === "loading" || !email ? "#aaa" : "#1a73e8",
                cursor: status === "loading" || !email ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "Đang gửi..." : "Đăng ký"}
            </button>

            <p style={{ marginTop: 14, fontSize: 12, color: "#aaa", textAlign: "center" }}>
              Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5, color: "#333" };
const inputStyle = {
  display: "block", width: "100%", padding: "10px 12px",
  fontSize: 14, border: "1px solid #ddd", borderRadius: 6,
  marginBottom: 14, boxSizing: "border-box",
};
const btnStyle = {
  marginTop: 8, width: "100%", padding: "12px",
  background: "#1a73e8", color: "#fff",
  border: "none", borderRadius: 7,
  fontSize: 15, fontWeight: 600,
};