import { useEffect, useState } from "react";
import requestCurrentCity from "./requestCurrentCity.js";

export default function useCurrentCity() {
    const [city, setCity] = useState(localStorage.getItem('localCity'))
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(city ? true : false)
    useEffect(() => {
        let ignore = false
        if (city) {
            
        } else {
            requestCurrentCity().then((data) => {
                if (!ignore) {
                    setCity(JSON.stringify(data))
                    setLoading(false)
                }
            }).catch((error) => {
                if (!ignore) {
                    setError(error)
                    setLoading(false)
                }
            })
        }

        return () => ignore = true
    }, [city])

    return {currentCity: JSON.parse(city), error, loading}
}