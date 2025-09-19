import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY='theme'

function getInitialTheme(){

    const saved =localStorage.getItem(STORAGE_KEY)

    if(saved==='light' || saved ==='dark') return saved

    return window.matchMedia("(prefer-color-scheme:dark)").matches? 'dark':'light'
}

export function ThemeProvider({children}){

    const [theme,setTheme]=useState(getInitialTheme)

    useEffect(()=>{
        const root = document.documentElement

        if(theme==='dark') root.setAttribute('data-theme','dark')
        else root.removeAttribute('data-theme')
        localStorage.setItem(STORAGE_KEY,theme)

    },[theme])

    const toggleTheme =useCallback(()=>setTheme(t=>t==='dark'?'light':'dark'))

    const setDark=useCallback(()=>setTheme('dark'))
    const setLight=useCallback(()=>setTheme('light'))


    const value =useMemo(
        ()=>({
            theme,
            isDark:theme==='dark',
            toggleTheme,
            setDark,
            setLight
        }),
        [theme,toggleTheme,setDark,setLight]
    )

    return <ThemeContext.Provider  value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(){
    const ctx = useContext(ThemeContext)

    if(!ctx) throw new Error("테마를 사용할 수 없습니다.")

    return ctx
}