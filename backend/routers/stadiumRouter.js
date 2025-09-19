const express = require("express");
const router = express.Router();
const Stadium = require("../models/StadiumSchema");
const { authMiddleware, adminOnly } = require("../middleware/auth"); // <-- auth.js로 변경

// 구장 등록 → admin 전용
router.post("/", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { name, capacity, available_times } = req.body;
        const stadium = await Stadium.create({ name, capacity, available_times });
        res.status(201).json(stadium);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 구장 조회 → 모두 가능
router.get("/", async (req, res) => {
    try {
        const stadiums = await Stadium.find();
        res.json(stadiums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
