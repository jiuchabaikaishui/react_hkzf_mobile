import { animated, useSpring } from '@react-spring/web'
import { useNavigate } from "react-router-dom";

export default function News() {
    const navigate = useNavigate()
    return (<>
        <div onClick={() => navigate('/login')}>
            这是新闻页
        </div>
    </>)
}