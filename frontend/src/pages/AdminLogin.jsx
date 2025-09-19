import React, { useEffect, useState } from 'react'
import { api } from "../lib/api"
import { useNavigate } from "react-router-dom"
import "./styles/AdminLogin.scss"

const AdminLogin = () => {

    const nav = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [checking, setChecking] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/api/auth/login',
                formData, {
                withCredentials: true
            }
            )
            if (response.data.user) {
                nav("/admin/post")
            }
        } catch (error) {
            const errorMsg = error.response.data.message || '로그인 실패'

            setError({
                message: errorMsg
            })
        }

    }

    return (
        <div className='login-container'>
            <div className='login-header'>
                <h3>관리자 로그인</h3>
                <p>관리자 전용 페이지 입니다.</p>
            </div>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className="form-field">

                    <label htmlFor="username">관리자 아이디 :</label>
                    <input
                        type="text"
                        name='username'
                        id='username'
                        value={formData.username}
                        onChange={handleChange}
                        required placeholder='관리자 아이디' />
                </div>
                <div className="form-field">

                    <label htmlFor="password">관리자 비밀번호 :</label>
                    <input type="password"
                        id='password'
                        name='password'
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='관리자 비밀번호' />
                </div>
                <div className="error-box"></div>
                <button type='submit'>로그인</button>
            </form>
        </div>
    )
}

export default AdminLogin