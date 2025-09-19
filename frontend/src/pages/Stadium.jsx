import React, { useEffect, useState } from "react";
import { getStadiums, createStadium } from "../api";

export default function Stadium() {
    const [stadiums, setStadiums] = useState([]);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    // 구장 등록용 state
    const [name, setName] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [capacity, setCapacity] = useState("");
    const [availableTimes, setAvailableTimes] = useState(""); // 문자열로 입력 후 쉼표로 분리

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setRole(payload.role);
                }

                const res = await getStadiums();
                setStadiums(Array.isArray(res) ? res : []);
            } catch (err) {
                console.error("Stadium fetch error:", err);
                setStadiums([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateStadium = async () => {
        if (!name || !lat || !lng || !capacity) return alert("모든 필드를 입력해주세요");

        const timesArray = availableTimes.split(",").map(t => t.trim());

        try {
            const res = await createStadium({
                name,
                capacity: Number(capacity),
                location: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)],
                },
                available_times: timesArray,
            });
            alert("구장 생성 완료: " + JSON.stringify(res));

            // 생성 후 목록 업데이트
            const updated = await getStadiums();
            setStadiums(Array.isArray(updated) ? updated : []);

            // 입력 초기화
            setName(""); setLat(""); setLng(""); setCapacity(""); setAvailableTimes("");
        } catch (err) {
            console.error("구장 생성 에러:", err);
            alert("구장 생성 실패");
        }
    };

    if (loading) return <p>로딩중...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>구장 관리</h2>

            {role === "admin" && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>구장 등록</h3>
                    <input
                        placeholder="구장 이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        placeholder="위도 (lat)"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    <input
                        placeholder="경도 (lng)"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />
                    <input
                        placeholder="수용인원"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />
                    <input
                        placeholder='가능 시간 (예: "10:00-12:00, 18:00-20:00")'
                        value={availableTimes}
                        onChange={(e) => setAvailableTimes(e.target.value)}
                    />
                    <button onClick={handleCreateStadium}>구장 등록</button>
                </div>
            )}

            {stadiums.length === 0 ? (
                <p>등록된 구장이 없습니다.</p>
            ) : (
                <ul>
                    {stadiums.map((s) => (
                        <li key={s._id}>
                            {s.name} (id: {s._id}) - 수용인원: {s.capacity}명
                            <br />
                            좌표: [{s.location?.coordinates?.join(", ")}]
                            <br />
                            가능 시간: {s.available_times?.join(", ")}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
