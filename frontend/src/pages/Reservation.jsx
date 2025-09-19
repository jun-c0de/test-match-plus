import React, { useEffect, useState } from "react";
import { getStadiums, createReservation, getMyReservations } from "../api";

export default function Reservation() {
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        fetchStadiums();
    }, []);

    const fetchStadiums = async () => {
        const res = await getStadiums();
        setStadiums(res);
    };

    const handleCreateReservation = async () => {
        if (!selectedStadium) return alert("구장을 선택하세요");
        const res = await createReservation({ stadiumId: selectedStadium, time });
        alert(JSON.stringify(res));
    };

    const handleGetMyReservations = async () => {
        const res = await getMyReservations();
        alert(JSON.stringify(res));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>예약</h2>
            <select value={selectedStadium} onChange={(e) => setSelectedStadium(e.target.value)}>
                <option value="">구장 선택</option>
                {stadiums.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                ))}
            </select>
            <input placeholder="시간대" value={time} onChange={(e) => setTime(e.target.value)} />
            <button onClick={handleCreateReservation}>예약 생성</button>
            <button onClick={handleGetMyReservations}>내 예약 조회</button>
        </div>
    );
}
