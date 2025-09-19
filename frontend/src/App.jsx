import React, { useState, useEffect, useCallback } from 'react';

// --- 상수 정의 ---
// [수정] process.env 코드를 완전히 제거하고, API 서버 주소를 직접 문자열로 할당합니다.
const API_URL = 'http://localhost:3000/api';

// --- 아이콘 컴포넌트 ---
// 아이콘을 SVG로 직접 정의하여 외부 라이브러리 없이 사용합니다.
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 mr-1 text-gray-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 mr-1 text-gray-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 mr-1 text-gray-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


// --- 헬퍼 함수 ---
// API 요청을 위한 fetch 래퍼 함수
const api = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      // 서버에서 보낸 에러 메시지를 우선적으로 사용
      throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// --- 컴포넌트 ---

// 로딩 스피너 컴포넌트
const Spinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// 알림 메시지 컴포넌트
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300";
  const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      {message}
    </div>
  );
};

// 인증 페이지 컴포넌트 (로그인/회원가입)
const AuthPage = ({ setToken, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone_number: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { email, password } = formData;
        const data = await api('/auth/login', 'POST', { email, password });
        setToken(data.token);
        setUser(data.user);
      } else {
        const data = await api('/auth/signup', 'POST', formData);
        setToken(data.token);
        setUser(data.user);
      }
    } catch (err) {
      setError(err.message || '요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">{isLogin ? '로그인' : '회원가입'}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input name="name" type="text" required className="w-full px-4 py-2 border rounded-md" placeholder="이름" onChange={handleChange} />
              <input name="phone_number" type="tel" required className="w-full px-4 py-2 border rounded-md" placeholder="전화번호" onChange={handleChange} />
            </>
          )}
          <input name="email" type="email" required className="w-full px-4 py-2 border rounded-md" placeholder="이메일" onChange={handleChange} />
          <input name="password" type="password" required className="w-full px-4 py-2 border rounded-md" placeholder="비밀번호" onChange={handleChange} />
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </button>
        </form>
        <p className="text-center">
          {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-semibold text-indigo-600 hover:underline">
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
};


// 구장 목록 페이지
const StadiumListPage = ({ onSelectStadium }) => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const data = await api('/stadiums');
        setStadiums(data);
      } catch (error) {
        console.error("Failed to fetch stadiums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStadiums();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stadiums.map(stadium => (
        <div key={stadium._id} onClick={() => onSelectStadium(stadium)} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
          <img src={`https://placehold.co/600x400/312e81/ffffff?text=${encodeURIComponent(stadium.name)}`} alt={stadium.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">{stadium.name}</h3>
            <p className="text-gray-600 mt-2 flex items-center"><IconMapPin /> {stadium.location?.coordinates ? `경도: ${stadium.location.coordinates[0]}, 위도: ${stadium.location.coordinates[1]}` : '위치 정보 없음'}</p>
            <p className="text-gray-600 flex items-center"><IconUsers /> 최대 {stadium.capacity}명</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 구장 상세 및 예약 페이지
const StadiumDetailPage = ({ stadium, token, onBack, showNotification }) => {
  const [loading, setLoading] = useState(false);

  const handleReservation = async (time) => {
    if (!window.confirm(`'${stadium.name}' 구장의 '${time}' 시간으로 예약하시겠습니까?`)) {
      return;
    }
    setLoading(true);
    try {
      await api('/reservations', 'POST', { stadiumId: stadium._id, time }, token);
      showNotification('성공적으로 예약되었습니다.', 'success');
      onBack(); // 예약 후 목록으로 돌아가기
    } catch (error) {
      showNotification(error.message || '예약에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:underline">← 목록으로 돌아가기</button>
      <img src={`https://placehold.co/800x400/312e81/ffffff?text=${encodeURIComponent(stadium.name)}`} alt={stadium.name} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h2 className="text-3xl font-bold mb-4">{stadium.name}</h2>
      <div className="flex space-x-6 text-lg mb-6">
        <p className="text-gray-700 flex items-center"><IconMapPin /> {stadium.location?.coordinates ? `경도: ${stadium.location.coordinates[0]}, 위도: ${stadium.location.coordinates[1]}` : '위치 정보 없음'}</p>
        <p className="text-gray-700 flex items-center"><IconUsers /> 최대 {stadium.capacity}명</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4">예약 가능 시간</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {stadium.available_times.map(time => (
          <button
            key={time}
            onClick={() => handleReservation(time)}
            disabled={loading}
            className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-gray-400"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

// 내 예약 페이지
const MyReservationsPage = ({ token, showNotification }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api('/reservations/my', 'GET', null, token);
      setReservations(data);
    } catch (error) {
      showNotification('예약 정보를 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showNotification]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancel = async (reservationId) => {
    if (!window.confirm('정말로 이 예약을 취소하시겠습니까?')) return;
    try {
      await api(`/reservations/${reservationId}`, 'PATCH', null, token);
      showNotification('예약이 성공적으로 취소되었습니다.', 'success');
      fetchReservations(); // 목록 새로고침
    } catch (error) {
      showNotification(error.message || '예약 취소에 실패했습니다.', 'error');
    }
  };

  if (loading) return <Spinner />;
  if (reservations.length === 0) return <p className="text-center text-gray-500 mt-8">예약 내역이 없습니다.</p>;

  return (
    <div className="space-y-4">
      {reservations.map(res => (
        <div key={res._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{res.stadium.name}</p>
            <p className="text-gray-600"><IconClock /> {new Date(res.createdAt).toLocaleDateString()} / {res.time}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${res.status === 'reserved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {res.status === 'reserved' ? '예약 완료' : '취소됨'}
            </span>
            {res.status === 'reserved' && (
              <button onClick={() => handleCancel(res._id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                예약 취소
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// 관리자 대시보드
const AdminDashboard = ({ token, showNotification }) => {
  const [stadiums, setStadiums] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStadium, setEditingStadium] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '', available_times: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const stadiumData = await api('/stadiums');
      const reservationData = await api('/reservations', 'GET', null, token);
      setStadiums(stadiumData);
      setReservations(reservationData);
    } catch (error) {
      showNotification('데이터를 불러오는 데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const stadiumData = {
      ...formData,
      capacity: Number(formData.capacity),
      available_times: formData.available_times.split(',').map(t => t.trim()),
    };

    try {
      if (editingStadium) {
        // 수정
        await api(`/stadiums/${editingStadium._id}`, 'PATCH', stadiumData, token);
        showNotification('구장 정보가 수정되었습니다.', 'success');
      } else {
        // 생성
        await api('/stadiums', 'POST', stadiumData, token);
        showNotification('새 구장이 등록되었습니다.', 'success');
      }
      setShowForm(false);
      setEditingStadium(null);
      fetchData();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleEdit = (stadium) => {
    setEditingStadium(stadium);
    setFormData({
      name: stadium.name,
      capacity: stadium.capacity,
      available_times: stadium.available_times.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (stadiumId) => {
    if (!window.confirm('정말로 이 구장을 삭제하시겠습니까? 모든 관련 예약 정보도 위험할 수 있습니다.')) return;
    try {
      await api(`/stadiums/${stadiumId}`, 'DELETE', null, token);
      showNotification('구장이 삭제되었습니다.', 'success');
      fetchData();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const openNewForm = () => {
    setEditingStadium(null);
    setFormData({ name: '', capacity: '', available_times: '' });
    setShowForm(true);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* 구장 관리 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">구장 관리</h2>
          <button onClick={openNewForm} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <IconPlus /> 새 구장 등록
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
            <h3 className="text-xl font-semibold">{editingStadium ? '구장 수정' : '새 구장 등록'}</h3>
            <input name="name" value={formData.name} onChange={handleFormChange} placeholder="구장 이름" className="w-full p-2 border rounded" required />
            <input name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} placeholder="수용 인원" className="w-full p-2 border rounded" required />
            <input name="available_times" value={formData.available_times} onChange={handleFormChange} placeholder="가능 시간 (쉼표로 구분, 예: 10:00-12:00, 14:00-16:00)" className="w-full p-2 border rounded" required />
            <div className="flex gap-4">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">저장</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">취소</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">이름</th><th className="p-3">수용인원</th><th className="p-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {stadiums.map(s => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.capacity}명</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><IconEdit /></button>
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><IconTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 전체 예약 현황 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">전체 예약 현황</h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">구장</th><th className="p-3">예약자</th><th className="p-3">시간</th><th className="p-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.stadium?.name || '삭제된 구장'}</td>
                  <td className="p-3">{r.user?.name || '탈퇴한 회원'}</td>
                  <td className="p-3">{r.time}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'reserved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {r.status === 'reserved' ? '예약' : '취소'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- 메인 App 컴포넌트 ---
function App() {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUserState] = useState(JSON.parse(localStorage.getItem('user')));
  const [page, setPage] = useState('stadiums'); // stadiums, stadiumDetail, myReservations, admin
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  const setUser = (newUser) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    setUserState(newUser);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  const handleSelectStadium = (stadium) => {
    setSelectedStadium(stadium);
    setPage('stadiumDetail');
  };

  const renderPage = () => {
    if (page === 'stadiumDetail' && selectedStadium) {
      return <StadiumDetailPage stadium={selectedStadium} token={token} onBack={() => setPage('stadiums')} showNotification={showNotification} />;
    }
    if (page === 'myReservations') {
      return <MyReservationsPage token={token} showNotification={showNotification} />;
    }
    if (page === 'admin' && user?.role === 'admin') {
      return <AdminDashboard token={token} showNotification={showNotification} />;
    }
    return <StadiumListPage onSelectStadium={handleSelectStadium} />;
  };

  if (!token || !user) {
    return <AuthPage setToken={setToken} setUser={setUser} />;
  }

  return (
    <>
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => setPage('stadiums')}>풋살장 예약</h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setPage('stadiums')} className="text-gray-600 hover:text-indigo-600">구장 목록</button>
              <button onClick={() => setPage('myReservations')} className="text-gray-600 hover:text-indigo-600">내 예약</button>
              {user.role === 'admin' && (
                <button onClick={() => setPage('admin')} className="text-gray-600 hover:text-indigo-600 font-semibold">관리자</button>
              )}
              <span className="text-gray-700">|</span>
              <span className="text-gray-800 hidden sm:block">환영합니다, {user.name}님!</span>
              <button onClick={handleLogout} title="로그아웃" className="p-2 rounded-full text-gray-600 hover:bg-gray-200"><IconLogout /></button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 py-8">
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default App;

