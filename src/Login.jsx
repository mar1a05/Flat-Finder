import { useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
    const { fetchUser } = useAuth();
    const [ formData, setFormData ] = useState({
        email: "",
        password: ""
    })

    const [ message, setMessage ] = useState("");
    const navigate = useNavigate();

    const handleChange = async(e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
    
            if (!response.ok) {
                throw new Error("Failed to login. Server responded with " + response.status);
            }
    
            const data = await response.json();
    
            if (data.status === "success") {
                Cookies.set("token", data.token, { expires: 1 });
                fetchUser();
                setMessage("Login successful. Redirecting...");
                setTimeout(() => navigate("/homepage"), 1500);
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Error connecting to server");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}/><br></br>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}/><br></br>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}

            <Link to="/forgot-password">Am uitat parola</Link>
        </div>
    )
}

export default Login;