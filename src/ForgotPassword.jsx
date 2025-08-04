import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/forgotPassword", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        })

        const data = await response.json();
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button type="submit">Trimite</button>
            </form>
        </div>
    )
}

export default ForgotPassword;