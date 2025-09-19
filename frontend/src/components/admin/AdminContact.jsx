import React, { useState, useEffect } from 'react'
import "./styles/AdminContact.scss"
import { api } from '../../lib/api'
import Swal from 'sweetalert2'
const AdminContact = () => {

    const [contacts, setContacts] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await api.get('/api/contact')
                setContacts(res.data)

            } catch (error) {
                console.log('문의글 가져오기 실패', error)
            }
        }

        fetchData()

    }, [])

    const handleStatusUpdate = async (contactId, newStatus) => {
        try {
            await api.put(
                `/api/contact/${contactId}`,
                { status: newStatus },
                { withCredentials: true }
            )

            setContacts((prev) =>
                prev.map((c) => (c._id === contactId ? { ...c, status: newStatus } : c))
            )
            Swal.fire("수정완료", "상태가 성공적으로 수정되었습니다.", "success")
        } catch (error) {
            console.log("수정실패", error)
            Swal.fire("오류발생", "수정중 문제가 발생했습니다.", "error")
        }
    }

    const showStatusChangeModal = async (contact) => {
        const { value: newStatus, isConfirmed } = await Swal.fire({
            title: "문의 상태 수정",
            input: "radio",
            inputOptions: {
                "pending": "대기중",
                "in progress": "진행중",
                "completed": "완료"
            },
            inputValue: contact.status,
            confirmButtonText: "적용하기",
            cancelButtonText: "취소",
            showCancelButton: true
        })
        if (isConfirmed && newStatus) {
            handleStatusUpdate(contact._id, newStatus)
        }

    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "삭제하시겠습니까?",
            text: "이 작업은 되돌릴 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        })
        if (!result.isConfirmed) {
            try {
                await api.delete(`/api/contact/${id}`, {
                    withCredentials: true
                })

                setContacts((prev) => prev.filter((c) => c._id !== id))
                Swal.fire("삭제완료", "문의가 성공적으로 삭제 되었습니다", "success")
            } catch (error) {
                console.log("삭제 실패", error)
                Swal.fire("오류 발생", "삭제 중 문제가 발생했습니다", "error")
            }
        }
    }

    return (
        <div className='inner admin-contact'>
            <h2>문의글 관리</h2>
            <div className="contact-wrapper">
                <ul className="contact-list">
                    {contacts.map((c, i) => (

                        <li key={c._id}>
                            <p>
                                <span className='key'>
                                    이름
                                </span>
                                :
                                <span className='value'>
                                    {c.name}
                                </span>
                            </p>
                            <p>
                                <span className='key'>email</span>
                                :
                                <span className='value'>
                                    {c.email}
                                </span>
                            </p>
                            <p>
                                <span className='key'>전화번호</span>:
                                <span className='value'>
                                    {c.phone}
                                </span>
                            </p>
                            <p><span className='key'>메세지</span></p>
                            <p className='message'>
                                {c.message}
                            </p>
                            <p>
                                <span className='key'>상태</span>
                                <span className={`status s-${(c.status || "").replace(" ", "-")}`}>
                                    {c.status}
                                </span>
                            </p>
                            <div className="btns">
                                <button
                                    onClick={() => showStatusChangeModal(c)}
                                >상태변경</button>
                                <button
                                onClick={() => handleDelete(c._id)}
                                >삭제</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AdminContact