const express = require("express");
const router = express.Router();
const Reservation = require("../models/ReservationSchema");
const Stadium = require("../models/StadiumSchema");
const { authMiddleware } = require("../middleware/auth"); // ✅ authMiddleware로 변경

// 예약 생성
router.post("/", authMiddleware, async (req, res) => {
    const { stadiumId, time } = req.body;

    const stadium = await Stadium.findById(stadiumId);
    if (!stadium) return res.status(404).json({ message: "구장을 찾을 수 없습니다." });

    if (!stadium.available_times.includes(time)) {
        return res.status(400).json({ message: "해당 시간대는 예약 불가합니다." });
    }

    const reservation = new Reservation({
        user: req.user.userId,
        stadium: stadiumId,
        time,
    });

    await reservation.save();
    res.status(201).json(reservation);
});

// 내 예약 조회
router.get("/my", authMiddleware, async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.userId }).populate("stadium");
    res.json(reservations);
});

module.exports = router;
