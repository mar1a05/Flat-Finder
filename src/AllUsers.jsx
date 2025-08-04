import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async() => {
            try{
                const token = Cookies.get("token");
                const response = await fetch("http://localhost:3000/allUsers", {
                    method: "GET",
                    headers: {
                        "Authorization": `bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                if(!response.ok){
                    const data = await response.json();
                    setError(data.messagge || "Failed to fetch all users.");
                    return;
                }

                const data = await response.json();
                setUsers(data.data);
            }catch(err){
                setError(err);
            }
        }
        fetchUsers()
    }, [])


    return (
        <div>
          <h1>All Users</h1> 
          {error && <p style={{color: "red"}}>{error}</p>} 
          <ul>
            {users.map((user) => (
                <li key={user._id}>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Age: {user.age}</p>
                    <p>Role: {user.role}</p>
                </li>
            ))}
          </ul>
        </div>
    )
}

export default AllUsers;