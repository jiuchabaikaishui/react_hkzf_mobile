import { useState, useEffect, useRef } from "react";
import { instance } from "./api";

function useNetwork(url, stringParams, type, parser) {    
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const parseRef = useRef(parser)
    useEffect(() => {
        console.log('stringParams：', stringParams);
        let ignore = false
        const request = async () => {
            try {
                let result = null
                switch (type) {
                    case 'GET': 
                        result = await instance.get(url, stringParams && JSON.parse(stringParams))
                        break;
                    case 'POST': 
                        result = await instance.post(url, stringParams && JSON.parse(stringParams))
                        break
                    default:
                        break;
                }
                if (!ignore && result) {
                    parseRef.current ? setData(parseRef.current(result)) : setData(result)
                }
                setLoading(false)
            } catch (error) {
                if (!ignore) {
                    setError(error)
                    setLoading(false)
                }
            }
        }
        request()
        return () => { 
            ignore = true 
            setLoading(false)
        }
    }, [url, stringParams, type])

    return { data, error, loading }
}
function useGet(url, params, parser) {
    return useNetwork(url, JSON.stringify(params), 'GET', parser)
}
function usePost(url, params) {
    return useNetwork(url, JSON.stringify(params), 'POST')
}

const useData = { get: useGet, post: usePost }
export default useData