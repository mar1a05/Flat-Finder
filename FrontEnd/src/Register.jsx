import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import styles from './Register.module.css'
// import axios from "axios";
import api from "./api"


function RegisterForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [errors, setErrors] = useState({});

    const [inputType, setInputType] = useState("text");

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password) => {
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        return password.length >= 6 && hasLetter && hasNumber && hasSpecialChar;
    }

    const validateAge = (birthDate) => {
        const today = new Date();
        const dob = new Date(birthDate);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();
        if(monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())){
            age--;
        }
        return age >= 18 && age <= 120;
    }

    const validateForm = () => {
        const newErrors = {};
        
        if(!email){
            newErrors.email = 'Required field';
        }

        if(!validateEmail(email)){
            newErrors.email = 'Please enter a valid email!';
        }

        if(!password){
            newErrors.password = 'Required field';
        }

        if(!validatePassword(password))
        {
            newErrors.password = 'Passwors must be at least 6 characters long, contain letters, numbers and special character!'
        }

        if(firstName.length < 2){
            newErrors.firstName = 'First name must be at least 2 characters long!';
        }

        if(!firstName){
            newErrors.firstName = 'Required field';
        }

        if(lastName.length < 2){
            newErrors.lastName = 'Last name must be at least 2 characters long!';
        }

        if(!lastName){
            newErrors.lastName = 'Required field';
        }

        if(!validateAge(birthDate)){
            newErrors.birthDate = 'You must be between 18 and 120 years!';
        }

        if(!birthDate){
            newErrors.birthDate = 'Required field';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(validateForm()){
            try{
                // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                // await setDoc(doc(db, 'users', userCredential.user.uid), {
                //     firstName,
                //     lastName,
                //     birthDate,
                //     email,
                //     password,
                //     role: "user",
                //     flats: []
                // })

                // navigate("/login");

                console.log(firstName, lastName, birthDate, email, password);

                await api.post("/users/register", {
                    email: email,
                    password: password,
                    birthDate: birthDate,
                    firstName: firstName,
                    lastName: lastName
                }
                // ,{
                //     headers:{
                //         Authorization: `bearer ${}`
                //     }  
                //   } 
                )

                navigate("/login");

            }catch(error){
                console.error('Error restering user: ', error);
                setErrors({firebase: 'Failed to register. Please try again!'});
            }
        }
    }



    const goToLogin = () => {
        navigate('/login')
    }

    const handleFocus = () => {
        setInputType("date");
      };
    
      const handleBlur = () => {
          setInputType("text");
      };

    


    return (
        <div className={styles.registerBody} >
            <div className={styles.registerHeader}>
                <span>Flat</span>
                <img className={styles.registerLogo} src="../public/images/logo/logo.svg" alt=""/>
                <span>Finder</span>
            </div>


            <form onSubmit={handleSubmit} className={styles.registerCard}>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet"/>

                <div className={styles.registerInputDiv}>
                    <input className={styles.registerInput} type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                    {errors.email && <p className={styles.registerError}>{errors.email}</p>}
                </div>

                <div className={styles.registerInputDiv}>
                    <input className={styles.registerInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                    {errors.password && <p className={styles.registerError}>{errors.password}</p>}
                </div>

                <div className={styles.registerInputDiv}>
                    <input className={styles.registerInput} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name"/>
                    {errors.firstName && <p className={styles.registerError}>{errors.firstName}</p>}
                </div>

                <div className={styles.registerInputDiv}>
                    <input className={styles.registerInput} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name"/>
                    {errors.lastName && <p className={styles.registerError}>{errors.lastName}</p>}
                </div>

                <div className={styles.registerInputDiv}>
                    <input className={styles.registerInput} type = {inputType} onFocus={handleFocus} onBlur={handleBlur} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="Birthdate"/>
                    {errors.birthDate && <p className={styles.registerError}>{errors.birthDate}</p>}
                </div>

                <button type="submit" className={styles.registerButton}>Register</button>

                <div className={styles.loginDiv}>
                    <span>Already a member?</span>
                    <button onClick={goToLogin} className={styles.registerButton}>Login</button>
                    
                </div>

                
            </form>

        </div>
    )
}

export default RegisterForm;

