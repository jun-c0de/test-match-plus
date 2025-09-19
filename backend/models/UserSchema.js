const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        phone_number: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, trim: true }, // 추가
        tier: {
            type: String,
            enum: ["Bronze", "Silver", "Gold", "Platinum"],
            default: null, // 일반 가입자는 초기 등급 없음
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user", // 일반 사용자 기본 role
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;