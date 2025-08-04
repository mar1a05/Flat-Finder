import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [ formData, setFormData ] = useState({
        name: "",
        email: "",
        password: "",
        age: ""
    })

    const navigate = useNavigate();
    const [ message, setMessage ] = useState("");

    const handleChange = async(e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const response  = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            console.log(data);

            if(response.ok){
                //setMessage("Registration successfully. You can log in now.")
                navigate('/signin');
            }else{
                setMessage("Registration failed. Please try again.")
            }
        }catch(err){
            setMessage("Error connecting to server.", err)
        }
    }


    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange}/><br></br>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}/><br></br>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}/><br></br>
                <input type="number" name="age" placeholder="Age"value={formData.age} onChange={handleChange}/><br></br>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register;