const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// JWT 검증 미들웨어
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "토큰이 없습니다." });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // userId, role
        next();
    } catch (err) {
        return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
    }
};

// 관리자 전용 미들웨어
const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "권한이 없습니다." });
    }
    next();
};

module.exports = { authMiddleware, adminOnly };
