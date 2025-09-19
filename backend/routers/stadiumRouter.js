// routes/stadiums.js

const express = require("express");
const router = express.Router();
const Stadium = require("../models/StadiumSchema");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const mongoose = require("mongoose"); // ADDED: For ObjectId validation

// --- 구장 등록 (관리자 전용) ---
router.post("/", authMiddleware, adminOnly, async (req, res, next) => { // ADDED: next
    try {
        const { name, location, capacity, available_times } = req.body;
        const stadium = await Stadium.create({ name, location, capacity, available_times });
        res.status(201).json(stadium);
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});

// --- 전체 구장 조회 ---
router.get("/", async (req, res, next) => { // ADDED: next
    try {
        const stadiums = await Stadium.find();
        res.json(stadiums);
    } catch (err) {
        next(err); // 에러 핸들러로 전달
    }
});

// --- 개별 구장 상세 조회 ---
// ADDED: New Route
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "유효하지 않은 구장 ID입니다." });
        }

        const stadium = await Stadium.findById(id);
        if (!stadium) {
            return res.status(404).json({ message: "구장을 찾을 수 없습니다." });
        }
        res.json(stadium);
    } catch (err) {
        next(err);
    }
});

// --- 구장 정보 수정 (관리자 전용) ---
// ADDED: New Route
router.patch("/:id", authMiddleware, adminOnly, async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "유효하지 않은 구장 ID입니다." });
        }

        const updatedStadium = await Stadium.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // new: true는 업데이트된 문서를 반환, runValidators: true는 스키마 유효성 검사 실행
        );

        if (!updatedStadium) {
            return res.status(404).json({ message: "구장을 찾을 수 없습니다." });
        }
        res.json({ message: "구장 정보가 성공적으로 수정되었습니다.", stadium: updatedStadium });
    } catch (err) {
        next(err);
    }
});

// --- 구장 삭제 (관리자 전용) ---
// ADDED: New Route
router.delete("/:id", authMiddleware, adminOnly, async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "유효하지 않은 구장 ID입니다." });
        }

        const deletedStadium = await Stadium.findByIdAndDelete(id);

        if (!deletedStadium) {
            return res.status(404).json({ message: "구장을 찾을 수 없습니다." });
        }
        res.status(200).json({ message: "구장이 성공적으로 삭제되었습니다." });
    } catch (err) {
        next(err);
    }
});

module.exports = router;