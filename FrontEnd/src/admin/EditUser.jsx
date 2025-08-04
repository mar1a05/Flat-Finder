/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./EditUser.module.css"
import api from "../api";
import { useAuth } from "../hooks/useAuth";

function EditUser() {

    const navigate = useNavigate();
    const {userID} = useParams();

    const [errors, setErrors] = useState({});
    const [inputType, setInputType] = useState("text");

    const [userData, setUserData] = useState({});
    const [updatedUserData, setUpdatedUserData] = useState({})

    const {user} = useAuth();

    console.log(userID);

    useEffect(() => {
        console.log(userID);
    }, [])

    useEffect(() => {
        const fetchUserData = async () => {
            
            // const userRef = doc(db, 'users', userID);
            // const userDoc = await getDoc(userRef);
            // console.log(userDoc);

            // if (userDoc.exists()) {
            //     setUserData(userDoc.data());
            // }


            const response = await api.get(`/users/${userID}`, {
                headers: {
                    Authorization: `bearer ${user.data.activeToken}`
                }
            })

            setUserData(response.data.data);
        };

        if (userID) {
            fetchUserData();
        }
    }, [userID]);
        
    console.log(userData);


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

        //return true; 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData((previous) => ({
            ...previous,
            [name]: value, 
        }));

        console.log(updatedUserData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {

                // const userDocRef = doc(db, 'users', userID); 
                // await updateDoc(userDocRef, {
                //     firstName: userData.firstName,
                //     lastName: userData.lastName,
                //     birthDate: userData.birthDate
                // });

                await api.patch('/users/updateUser', {
                    ID: userID,
                    userData: updatedUserData
                }, {
                    headers: {
                        Authorization: `bearer ${user.data.activeToken}`
                    }
                })

                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile: ', error);
                setErrors({ firebase: 'Failed to update profile. Please try again!' });
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
    <div className={styles.updateProfileDiv}>
            <form onSubmit={handleSubmit} className={styles.updateProfileCard}>

                <div className={styles.updateProfileInputDiv}>
                    <input
                        className={styles.updateProfileInput}
                        type="text"
                        value={updatedUserData.firstName ? updatedUserData.firstName : userData.firstName}
                        onChange={handleChange}
                        name = "firstName"
                        placeholder="First name"
                    />
                    {errors.firstName && <p className={styles.updateProfileError}>{errors.firstName}</p>}
                </div>

                <div className={styles.updateProfileInputDiv}>
                    <input
                        className={styles.updateProfileInput}
                        type="text"
                        value={updatedUserData.lastName ? updatedUserData.lastName : userData.lastName}
                        onChange={handleChange}
                        name = "lastName"
                        placeholder="Last name"
                    />
                    {errors.lastName && <p className={styles.updateProfileError}>{errors.lastName}</p>}
                </div>

                <div className={styles.updateProfileInputDiv}>
                    <input
                        className={styles.updateProfileInput}
                        type={inputType}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={updatedUserData.birthDate ? updatedUserData.birthDate : userData.birthDate}
                        onChange={handleChange}
                        name = "birthDate"
                        placeholder="Birthdate"
                    />
                    {errors.birthDate && <p className={styles.updateProfileError}>{errors.birthDate}</p>}
                </div>

                <button type="submit" className={styles.updateButton}>Update Profile</button>
            </form>
        </div>
  )
}

export default EditUser