import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteProfile = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleDelete = async() => {
        if(window.confirm("Are you sure you want to delete your account?")){
            try{
                const token = Cookies.get("token");
                const response = await fetch("http://localhost:3000/deleteProfile", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if(!response.ok){
                    throw new Error("Failed to delete account!");
                }

                Cookies.remove("token");
                console.log("Account deleted successfully.");
                navigate("/");
            }catch(err){
                setError(err);
            }
        }
    }
    return (
        <div>
            <h1>Delete profile</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <button onClick={handleDelete}>Delete profile</button>
        </div>
    )
}

export default DeleteProfile;