import { useCallback, useRef } from 'react'
import { chckUsrNm } from '../functions/APIs'

const useDebounce = (fn, time, id = null) => {
    const timer = useRef(null)
    return useCallback((...args) => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        return new Promise((rslv, rjct) => {
            timer.current = setTimeout(async () => {
                // let item = args
                fn(...args)
                // (id === "uName" && await chckUsrNm(...args))
                rslv(id === "uName" && await chckUsrNm(...args))
            }, time)
        })

    }, [fn])
}

export default useDebounce