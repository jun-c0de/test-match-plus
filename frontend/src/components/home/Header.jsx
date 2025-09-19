import React, { useEffect, useState } from 'react'
import Nav from "./Nav"
import "./styles/Header.scss"
import { useTheme } from '../../context/ThemeContext'
const Header = () => {
    const { theme, toggleTheme } = useTheme()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        handleScroll()

        window.addEventListener('scroll', handleScroll)

    }, [])

    useEffect(() => {
        const onKey = (e) => e.key == 'Escape' && setMenuOpen(false)

        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    return (
        <header className={`${scrolled ? "scroll" : ""} ${menuOpen ? "is-open" : ""} `}>
            <div className="inner">
                <h4>MATCH PLUS</h4>
                <div className="right-wrap">
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        className='mob-nav-btn'>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                    </button>
                    <Nav />
                    <button className='btn' onClick={toggleTheme}>{theme}</button>

                </div>
            </div>
        </header>
    )
}

export default Header