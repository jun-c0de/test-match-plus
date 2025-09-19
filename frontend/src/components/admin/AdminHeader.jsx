import React from 'react'
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import "./styles/AdminHeader.scss"
const AdminHeader = () => {
    const nav = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // 로그아웃 API 호출 (쿠키 삭제)
            await api.post("/api/auth/logout", {}, { withCredentials: true });

            // 로그인 페이지로 이동
            nav("/admin/login", { replace: true });
        } catch (err) {
            console.error("로그아웃 실패:", err);
        }
    };
    return (
        <div className='inner admin-header'>
            <form onSubmit={handleLogout}>
                <button type="submit">로그아웃</button>
            </form>
        </div>
    )
}

export default AdminHeader