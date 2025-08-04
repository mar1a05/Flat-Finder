/* eslint-disable no-unused-vars */

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase'; 
import styles from './MyProfile.module.css';
import { useAuth } from "./hooks/useAuth";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";


function MyProfile() {
    
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [inputType, setInputType] = useState("text");
    const {user, setUser, fetchUser} = useAuth();
    console.log(user);
    const [password, setPassword] = useState("");
    
    const [userData, setUserData] = useState({});

    // if(user){
    //     setUserData(user.data);
    // }

    useEffect(() => {
        if(user){
            setUserData(user.data);
        }
    }, [user])

    console.log(userData);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if (user) {
    //             const userRef = doc(db, 'users', user.uid);
    //             const userDoc = await getDoc(userRef);
    //             if (userDoc.exists()) {
    //                 setUserData(userDoc.data());
    //             }
    //         }
    //     };
    //     fetchUserData();
    // }, [user]);

   

    // const validatePassword = async () => {
    //     try{
    //         // const currentUser = auth.currentUser;
    //         // const credential = EmailAuthProvider.credential(userData.email, password);
    //         // const reAuth = await reauthenticateWithCredential(currentUser, credential);

    //         // if(!reAuth) throw Error("Missing data");
            
    //         // return true;

    //         const response = await api.patch("/users/update", {
    //             headers:{
    //                 Authorization: `bearer ${user.data.activeToken}`
    //             }  
    //         })

    //         console.log(response);

    //     }catch(error){
    //         console.error("Trouble verifying password", error);
    //         const newErrors = {};
    //         newErrors.password = "Passwords don't match";
    //         setErrors(newErrors);

    //         return false;
    //     }
    // }
        

    const validateForm = () => {
        const newErrors = {};

        if (userData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters long!';
        }

        if (userData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters long!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((previous) => ({
            ...previous,
            [name]: value, 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const isPasswordValid = await validatePassword();
        if (validateForm()) {
            try {

                // const userDocRef = doc(db, 'users', user.uid); 
                // await updateDoc(userDocRef, {
                //     firstName: userData.firstName,
                //     lastName: userData.lastName,
                //     birthDate: userData.birthDate
                // });

                const response = await api.patch("/users/update",{
                    userData: userData,
                    password: password
                },{
                    headers:{
                        Authorization: `bearer ${user.data.activeToken}`
                    }  
                })

                fetchUser();

                navigate("/homepage/my-flats"); 
            } catch (error) {
                console.error('Error updating profile: ', error);
                setErrors({ server: error.response.data.message });
            }
        }
    };

    const handleFocus = () => {
        setInputType("date");
       
    };

    const handleBlur = () => {
        setInputType("text");
    };

    return (
        <div className={styles.profileDiv}>

            <form onSubmit={handleSubmit} className={styles.profileCard}>

                <div className={styles.updateInputDiv}>
                    <input
                        className={styles.updateInput}
                        type="text"
                        value={userData.firstName}
                        onChange={handleChange}
                        name = "firstName"
                        placeholder="First name"
                    />
                    {errors.firstName && <p className={styles.profileError}>{errors.firstName}</p>}
                </div>

                <div className={styles.updateInputDiv}>
                    <input
                        className={styles.updateInput}
                        type="text"
                        value={userData.lastName}
                        onChange={handleChange}
                        name = "lastName"
                        placeholder="Last name"
                    />
                    {errors.lastName && <p className={styles.profileError}>{errors.lastName}</p>}
                </div>

                <div className={styles.updateInputDiv}>
                    <input
                        className={styles.updateInput}
                        type={inputType}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={userData.birthDate}
                        onChange={handleChange}
                        name = "birthDate"
                        placeholder="Birthdate"
                    />
                    {errors.birthDate && <p className={styles.profileError}>{errors.birthDate}</p>}
                </div>

                <div className={styles.updateInputDiv}>
                    <p >Please revalidate your password to update your profile</p>
                    <input 
                        className={styles.updateInput}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name = "password"
                        placeholder="Password"
                    />
                    {errors.server && <p className={styles.profileError}>{errors.server}</p>}
                </div>

                <button type="submit" className={styles.updateButton}>Update Profile</button>
            </form>
        </div>
    );
}

export default MyProfile;
