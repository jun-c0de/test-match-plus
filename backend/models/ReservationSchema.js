const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        stadium: { type: mongoose.Schema.Types.ObjectId, ref: "Stadium", required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            enum: ["reserved", "canceled"],
            default: "reserved",
        },
    },
    { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
