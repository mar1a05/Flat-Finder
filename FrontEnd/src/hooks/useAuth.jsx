// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { auth, db } from "../../firebase";

// function useAuth(){
//     const [user, setUser] = useState(null);
//     const [flats, setFlats] = useState(null);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//             if(authUser){
//                 setUser(authUser);
//                 const fetchUserData = async() => {
//                     const userDoc = doc(db, 'users', authUser.uid);
//                     const userSnapshot = await getDoc(userDoc);
//                     if(userSnapshot.exists()){
//                         const userData = userSnapshot.data();
//                         setFlats(userData.flats || []);
//                     }
//                 }

//                 fetchUserData();
//             }else{
//                 setUser(null);
//                 setFlats(null);
//             }
//         })

//         return () => unsubscribe();
//     }, [])

//     return {user, flats};
// }

// export default useAuth;





/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    const fetchUser = async() => {

        try{
            const token = Cookies.get("token");
            if(!token) {
                console.log("Token not found");
                setIsFetching(false);
                return;
            }

            const response = await api.get("/me", {
                headers: {
                    Authorization: `bearer ${token}` 
                }
            })

            const data = await response.data;
            setUser(data);

        }catch(err){
            console.log("Error fetching user: ", err);
            setUser(null);
            Cookies.remove("token");
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return <AuthContext.Provider value = {{ user, setUser, fetchUser, isFetching}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);