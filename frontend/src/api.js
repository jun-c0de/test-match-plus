const API_URL = "http://localhost:3000/api";

export const signup = async (data) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    return res.json();
};

export const login = async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    return res.json();
};

export const getStadiums = async () => {
    const res = await fetch(`${API_URL}/stadiums`, {
        credentials: "include",
    });
    return res.json();
};

export const createStadium = async (data) => {
    const res = await fetch(`${API_URL}/stadiums`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    return res.json();
};

export const createReservation = async (data) => {
    const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
    });
    return res.json();
};

export const getMyReservations = async () => {
    const res = await fetch(`${API_URL}/reservations/my`, {
        credentials: "include",
    });
    return res.json();
};
