// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // 개발 중 에러 확인을 위해 콘솔에 로그 출력

    // Mongoose CastError (잘못된 형식의 ObjectId) 처리
    if (err.name === 'CastError') {
        return res.status(400).json({ message: '유효하지 않은 ID 형식입니다.' });
    }

    // Mongoose ValidationError 처리
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    // 기본 500 서버 에러
    res.status(500).json({
        message: "서버 내부에서 오류가 발생했습니다.",
        // 개발 환경에서만 에러 상세 정보 포함
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
};

module.exports = errorHandler;