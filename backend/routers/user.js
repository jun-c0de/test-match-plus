const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT 시크릿 (환경변수 권장)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ---------------- 회원가입 ----------------
router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;

        // 필드 체크
        if (!name || !email || !phone_number || !password) {
            return res.status(400).json({ message: "모든 필드를 입력해주세요." });
        }

        // 이메일 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 유저 생성
        const newUser = await User.create({
            name,
            email,
            phone_number,
            password: hashedPassword, // 해시 저장
            // tier=null, role=user → 모델 기본값 사용
        });

        // JWT 발급
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ message: "회원가입 완료", token, user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------------- 로그인 ----------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 유저 확인
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

        // JWT 발급
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "로그인 성공", token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;