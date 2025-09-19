// routes/reservations.js

const express = require("express");
const router = express.Router();
const Reservation = require("../models/ReservationSchema");
const Stadium = require("../models/StadiumSchema");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const mongoose = require("mongoose"); // ADDED: For ObjectId validation

// --- 예약 생성 (중복 방지 로직 추가) ---
router.post("/", authMiddleware, async (req, res, next) => { // ADDED: next
    try {
        const { stadiumId, time } = req.body;

        // --- VALIDATION ---
        if (!mongoose.Types.ObjectId.isValid(stadiumId)) {
            return res.status(400).json({ message: "유효하지 않은 구장 ID입니다." });
        }
        if (!time) {
            return res.status(400).json({ message: "예약 시간을 입력해주세요." });
        }
        // --- END VALIDATION ---

        const stadium = await Stadium.findById(stadiumId);
        if (!stadium) return res.status(404).json({ message: "구장을 찾을 수 없습니다." });

        if (!stadium.available_times.includes(time)) {
            return res.status(400).json({ message: "해당 시간대는 예약 불가합니다." });
        }

        // CHANGED: 중복 예약 방지 로직
        const existingReservation = await Reservation.findOne({
            stadium: stadiumId,
            time,
            status: "reserved", // 'reserved' 상태인 예약만 확인
        });

        if (existingReservation) {
            return res.status(409).json({ message: "이미 예약된 시간대입니다." }); // 409 Conflict
        }

        const reservation = new Reservation({
            user: req.user.userId,
            stadium: stadiumId,
            time,
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});

// --- 내 예약 조회 ---
router.get("/my", authMiddleware, async (req, res, next) => { // ADDED: next
    try {
        const reservations = await Reservation.find({ user: req.user.userId })
            .populate("stadium", "name location") // stadium 필드에서 name과 location만 가져오기
            .sort({ createdAt: -1 }); // 최신순으로 정렬
        res.json(reservations);
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});

// --- 예약 취소 ---
// ADDED: New Route
router.patch("/:id", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "유효하지 않은 예약 ID입니다." });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({ message: "예약 정보를 찾을 수 없습니다." });
        }

        // 본인의 예약만 취소 가능
        if (reservation.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "예약을 취소할 권한이 없습니다." });
        }

        // 이미 취소된 예약은 변경 불가
        if (reservation.status === 'canceled') {
            return res.status(400).json({ message: "이미 취소된 예약입니다." });
        }

        reservation.status = "canceled";
        await reservation.save();

        res.json({ message: "예약이 성공적으로 취소되었습니다.", reservation });
    } catch (err) {
        next(err);
    }
});


// --- 전체 예약 목록 조회 (관리자 전용) ---
// ADDED: New Route
router.get("/", authMiddleware, adminOnly, async (req, res, next) => {
    try {
        const reservations = await Reservation.find({})
            .populate("stadium", "name")
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(reservations);
    } catch (err) {
        next(err);
    }
});

module.exports = router;