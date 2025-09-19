import { useCallback } from "react";

export default function useSmoothScroll(){

    const scrollTo =useCallback((id)=>{
        const el = document.getElementById(id)

        if(el){
            el.scrollIntoView({
                behavior:"smooth",
                block:"start"
            })
        }
    })

    return scrollTo
}