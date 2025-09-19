import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Stadium from "./pages/Stadium";
import Reservation from "./pages/Reservation";
import { AuthProvider, AuthContext } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/stadiums"
            element={
              <ProtectedRoute requiredRole="admin">
                <Stadium />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function Navbar() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {!isLoggedIn && (
        <>
          <Link to="/signup" style={{ marginRight: "10px" }}>회원가입</Link>
          <Link to="/login" style={{ marginRight: "10px" }}>로그인</Link>
        </>
      )}
      {isLoggedIn && (
        <>
          {user?.role === "admin" && <Link to="/stadiums" style={{ marginRight: "10px" }}>구장</Link>}
          <Link to="/reservations" style={{ marginRight: "10px" }}>예약</Link>
          <button onClick={logout}>로그아웃</button>
        </>
      )}
    </nav>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useContext(AuthContext);

  // 로그인 되었지만 user 초기화 중이면 기다림
  if (isLoggedIn && !user) return null;

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

  return children;
}

function Home() {
  return <h2 style={{ padding: "20px" }}>홈 화면</h2>;
}

export default App;
