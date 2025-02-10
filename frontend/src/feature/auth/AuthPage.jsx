import Endpoints from "../../network/endpoints";
import request from "../../network/request";
import { notifySuccess, notifyError } from "../../utills/toastService";
import "./AuthPage.scss";
import { useState } from "react";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";

const AuthPage = () => {

    const [isLoginPage, setIsLoginPage] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handelSubmit = async (e, type) => {
        e.preventDefault()
        setLoading(true)
        const email = e.target.email.value
        const password = e.target.password.value

        const payLoad = {
            email,
            password
        }
        if (type === "register") payLoad.fullName =  e.target.fullName.value

        try {

            const { success, data } = await request({
                url: type === 'register' ? Endpoints.register : Endpoints.login,
                method: "POST",
                data: payLoad
            })
            if (success) {
                notifySuccess(`${type} Success`)
                const {token} = data
                Cookies.set("token",token)
                if(type === 'login') navigate("/")
            } else {
                notifyError(data)
            }
            e.target.reset();
        } catch (error) {
            console.error(error)
            notifyError("error occured please try again later")
        }finally{
            setLoading(false)
        }
    }

    return (<div >
        <div className="auth-wrraper">
            {/* Login Form  */}
            {
                isLoginPage ?
                    <div className="form-wrraper">
                        <div className="form-head">
                            <h2>Welcome back</h2>
                            <p>Sign in to your account</p>
                        </div>
                        <form onSubmit={(e) => handelSubmit(e, 'login')}>
                            <div className="input-wrraper">
                                <label htmlFor="email">Email address</label>
                                <input id="email" name="email" placeholder="Enteer email address" type="email" required />
                            </div>
                            <div className="input-wrraper">
                                <label htmlFor="password">Password</label>
                                <input id="password" placeholder="Enteer password" name="password" type="password" required />
                            </div>
                            <button disabled={loading}
                                style={{
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.8 : 1
                                }}
                                type="submit">Login</button>
                        </form>
                        <div className="form-bottom">
                            <p>Dont have an account?</p>
                            <span onClick={() => setIsLoginPage(!isLoginPage)}>Register now</span>
                        </div>
                    </div>
                    //  Register Form (Initially Hidden) 
                    : <div className="form-wrraper">
                        <div className="form-head">
                            <h2>Create account</h2>
                            <p>Sign up for a new account</p>
                        </div>
                        <form onSubmit={(e) => handelSubmit(e, 'register')}>
                            <div className="input-wrraper">
                                <label htmlFor="fullName">Full name</label>
                                <input id="fullName" name="fullName" placeholder="Enteer full name" type="text" required />
                            </div>
                            <div className="input-wrraper">
                                <label htmlFor="email">Email address</label>
                                <input id="email" name="email" placeholder="Enter email address" type="email" required />
                            </div>
                            <div className="input-wrraper">
                                <label htmlFor="password">Password</label>
                                <input id="password" placeholder="Enteer password" name="password" type="password" required />
                            </div>
                            <button type="submit">Create account</button>
                        </form>
                        <div className="form-bottom">
                            <p>Already have an account?</p>
                            <span onClick={() => setIsLoginPage(!isLoginPage)}>Login now</span>
                        </div>
                    </div>
            }
        </div>
    </div>)
}

export default AuthPage;