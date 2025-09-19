// index.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- Middleware ----------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONT_ORIGIN || "http://localhost:3000", // 프론트 주소
        credentials: true, // 쿠키 전달 허용
    })
);

// ---------------- Database ----------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("MongoDB 연결 실패", err));

// ---------------- Routers ----------------
const userRouter = require("./routers/user");
const stadiumRouter = require("./routers/stadiumRouter");
const reservationRouter = require("./routers/reservationRouter");

// 사용자 인증 / 회원가입 / 로그인
app.use("/api/auth", userRouter);

// 구장 관련
app.use("/api/stadiums", stadiumRouter);

// 예약 관련
app.use("/api/reservations", reservationRouter);

// ---------------- 기본 라우트 ----------------
app.get("/", (req, res) => {
    res.send("Hello Express");
});

// ---------------- Server Start ----------------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
