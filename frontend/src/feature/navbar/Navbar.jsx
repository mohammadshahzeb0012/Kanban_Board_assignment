import { useNavigate } from "react-router-dom"
import "./Navbar.scss"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { resetState } from "../board/slice"

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handelLogout = () => {
        Cookies.remove("token")
        dispatch(resetState())
        navigate("/auth")
    }

    return (
        <div className="navbar">
            <span>Kanban</span>
            <button onClick={handelLogout}>Log out</button>
        </div>
    )
}

export default Navbar
