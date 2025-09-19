// routes/users.js

const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth"); // ADDED
const { body, validationResult } = require("express-validator"); // ADDED

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// --- 회원가입 (입력값 검증 추가) ---
router.post(
    "/signup",
    // ADDED: Validation rules
    [
        body("name", "이름을 입력해주세요.").notEmpty().trim(),
        body("email", "유효한 이메일을 입력해주세요.").isEmail(),
        body("phone_number", "전화번호를 입력해주세요.").notEmpty().trim(),
        body("password", "비밀번호는 최소 6자 이상이어야 합니다.").isLength({ min: 6 }),
    ],
    async (req, res, next) => { // ADDED: next
        // ADDED: Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, phone_number, password } = req.body;

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "이미 가입된 이메일입니다." });
            }
            // phone_number 중복 체크도 추가 가능
            user = await User.findOne({ phone_number });
            if (user) {
                return res.status(400).json({ message: "이미 가입된 전화번호입니다." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                phone_number,
                password: hashedPassword,
            });

            // 회원가입 시에는 토큰과 함께 사용자 정보 일부만 반환
            const userResponse = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            };

            const token = jwt.sign(
                { userId: newUser._id, role: newUser.role },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.status(201).json({ message: "회원가입 완료", token, user: userResponse });
        } catch (err) {
            next(err); // 에러 핸들러로 전달
        }
    }
);

// --- 로그인 ---
router.post("/login", async (req, res, next) => { // ADDED: next
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

        // 로그인 시에는 비밀번호를 제외한 사용자 정보 반환
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            tier: user.tier,
        };

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "로그인 성공", token, user: userResponse });
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});


// --- 내 정보 조회 ---
// ADDED: New Route
router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        // req.user.userId는 authMiddleware에서 설정해 줌
        // .select("-password")를 사용하여 비밀번호 필드를 제외하고 조회
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// --- 내 정보 수정 ---
// ADDED: New Route
router.patch("/me", authMiddleware, async (req, res, next) => {
    try {
        const { name, phone_number } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (phone_number) updateData.phone_number = phone_number;

        // 수정할 내용이 없으면 에러
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "수정할 내용을 입력해주세요." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true }
        ).select("-password");

        res.json({ message: "정보가 성공적으로 수정되었습니다.", user: updatedUser });
    } catch (err) {
        next(err);
    }
});

module.exports = router;