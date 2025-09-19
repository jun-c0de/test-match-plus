import React, { useState, useContext } from "react";
import { login } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await login({ email, password });
        if (res.token) {
            localStorage.setItem("token", res.token);
            const payload = JSON.parse(atob(res.token.split(".")[1]));
            setUser(payload);
            setIsLoggedIn(true);
            alert("로그인 성공!");
            navigate("/"); // 로그인 후 홈으로 이동
        } else {
            alert("로그인 실패");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>로그인</h2>
            <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}
