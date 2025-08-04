import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'
import api from "./api";
import Cookies from "js-cookie";
import { useAuth } from "./hooks/useAuth";



function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    const {fetchUser, isFetching} = useAuth(); 

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            // await signInWithEmailAndPassword(auth, email, password);
            // navigate('/homepage/my-flats');

            const response = await api.post("/users/login", {
                email: email,
                password: password
            })

            // if (!response.ok) {
            //     throw new Error("Failed to login. Server responded with " + response.status);
            // }

            const data = await response.data;
            console.log(data)
            if (data.status === "success") {
                console.log(data)
                Cookies.set("token", data.token, {expires: 7});
                await fetchUser();

                navigate('/homepage/my-flats');
                
            } else {
                setErrors(data.message || "Login failed.");
            }
            

        }catch(error){
            setErrors('Invalid email or password', error);
        }
    }

    const goToRegister = () => {
        navigate('/register')
    }

    const handleForgotPassword = async(e) => {
        e.preventDefault();
        if(email == ''){
            setErrors("Invalid email.");
        }
        try{
            await api.post("/forgotPassword", {
                email: email
            })

            setErrors("Email sent to the email address provided.");
        }catch(e){
            console.error("Couldnt send a forgot password email", e);
        }
    }

    return (
        <div className={styles.loginBody}>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet"/>

            <div className={styles.loginHeader}>
                <span>Flat</span>
                <img className={styles.loginLogo} src="./images/logo/logo.svg" alt=""/>
                <span>Finder</span>
            </div>
            <form onSubmit={handleSubmit} className={styles.loginCard}>
        
                <input className={styles.loginInput} type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>

                <input className={styles.loginInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                
                {errors && <p className={styles.loginError}>{errors}</p>}

                <button type="submit" className={styles.loginButton}>Login</button>

                <div className={styles.signUpDiv}>
                    <span>Don&apos;t have an account?</span>
                    <button onClick={goToRegister} className={styles.loginButton}>Register</button>
                    <button onClick={handleForgotPassword}>Forgot Password</button>
                    {errors && <p className={styles.registerError}>{errors}</p>}
                </div>
                
            </form>
        </div>
    )
}

export default LoginForm;