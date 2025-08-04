/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const fetchUser = async() => {
        const token = Cookies.get("token");

        if(!token) return;

        try{
            const response = await fetch("http://localhost:3000/me", {
                method: "GET",
                headers: {
                    Authorization: `bearer ${token}`
                }
            })

            const data = await response.json();
            if(response.ok){
                setUser(data);
            }else{
                setUser(null);
                Cookies.remove("token");
            }
        }catch(err){
            console.log("Error fetching user: ", err);
            setUser(null);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return <AuthContext.Provider value = {{ user, setUser, fetchUser}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);