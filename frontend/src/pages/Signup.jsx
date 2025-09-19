import React, { useState } from "react";
import { signup } from "../api";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const res = await signup({ name: "테스터", email, phone_number: "01000000000", password });
        alert(JSON.stringify(res));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>회원가입</h2>
            <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>회원가입</button>
        </div>
    );
}
