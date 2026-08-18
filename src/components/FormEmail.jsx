"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "subscription_modal_last_shown";
const COOLDOWN_DAYS = 5;
const FORM_ENDPOINT = "https://email-marking.tailieutoan.vn/subscription/form";

// Subscribe vào cả 2 list
const LIST_IDS = [3, 4];

export default function SubscriptionModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
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
    if (name) body.append("name", name);
    LIST_IDS.forEach((id) => body.append("l[]", id));

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (res.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } else {
        const text = await res.text();
        setStatus("error");
        setErrorMsg(text || `Lỗi ${res.status}`);
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
            <button onClick={handleClose} style={btnStyle("#1a73e8")}>Đóng</button>
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
              style={btnStyle(status === "loading" || !email ? "#aaa" : "#1a73e8", true)}
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
const btnStyle = (bg, fullWidth = false) => ({
  marginTop: 8,
  ...(fullWidth ? { width: "100%" } : { padding: "10px 28px" }),
  padding: "12px",
  background: bg, color: "#fff",
  border: "none", borderRadius: 7,
  cursor: bg === "#aaa" ? "not-allowed" : "pointer",
  fontSize: 15, fontWeight: 600,
});