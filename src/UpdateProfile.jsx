import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const UpdateProfile = () => {
    const [userData, setUserData] = useState({name: "", email: "", age: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async() => {
            try{
                const token = Cookies.get("token");
                const response = await fetch("http://localhost:3000/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if(!response.ok){
                    throw new Error("Failed to load user data.");
                }

                const data = await response.json();
                setUserData(data.data);
            }catch(err){
                setError(err);
            }
        }
        fetchUserData()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name] : value 
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const token = Cookies.get("token");
            const response = await fetch("http://localhost:3000/updateProfile", {
                method: "PATCH",
                headers: {
                    "Authorization": `bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })

            if(!response.ok){
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            console.log(data);
            navigate("/homepage");
        }catch(err){
            setError(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleChange}/>
                <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange}/>
                <input type="number" name="age" placeholder="Age" value={userData.age} onChange={handleChange}/>
                <button type="submit">Update profile</button>
                {error ? <p>Error!</p> : null}
            </form>
        </div>
    )
}

export default UpdateProfile;