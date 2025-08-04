import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3000/resetPassword/${token}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password})
        })

        const data = await response.json();

        if(data.status === "success"){
            navigate("/signin");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Trimite</button>
            </form>
        </div>
    )
}

export default ResetPassword;