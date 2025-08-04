import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import styles from './Header.module.css';
import { useAuth } from "./hooks/useAuth";
import Cookies from "js-cookie";
import api from "./api";


function Header(){
    const [userData, setUserData] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    useEffect(() => {
        if(user && user.data?.isAdmin){
            setIsAdmin(user.data.isAdmin);
        }
    }, [user])
    // console.log(user);

    // useEffect(() => {
    //     if(user)
    //         setIsLoading(false);
    // }, [user])
    

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         const fetchUserData = async () => {
    //             const userDocRef = doc(db, 'users', user.uid); 
    //             const userDoc = await getDoc(userDocRef);
    //             if(userDoc.exists()){
    //                 const finalUserData = userDoc.data();
    //                 setUserData(finalUserData);
    //                 setRole(finalUserData.role);
    //             }
    //             setIsLoading(false);
    //         }
    //         fetchUserData();
    //     })

    //     return () => unsubscribe();
    // }, [])



   
    const handleLogout = async() => {
        try{
            Cookies.remove("token");
            navigate('/login');
        }catch(error){
            console.log('Error logging out', error);
        }
    }

    const handleDelete = async() => {
        try{
            // const user = auth.currentUser;

            // if(user){
            //     const uid = user.uid;
            //     await deleteDoc(doc(db, 'users', uid));
            //     await deleteUser(user);
            //     navigate('/register');
            // }

            await api.delete("/users/delete",{
                headers:{
                    Authorization: `bearer ${user.data.activeToken}`
                }  
            });
            navigate('/register');
        }catch(error){
            console.log('Error deleting user', error);
        }
    }

    return (
        <>
            <header className={styles.header}>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet"/>
                <img className={styles.logo} src="../public/images/logo/logo.svg" alt=""/>
                <div className={styles.userAndWelcomeMessage}>
                    {user?.data?.firstName ? `Hello, ${user.data.firstName}!` : "Hello, Guest!"}
                </div>
                
                <button className={styles.headerButton} onClick={() => navigate('/homepage/profile', { state: { userData }})}>My Profile</button>
                <button className={styles.headerButton} onClick={() => navigate('/homepage/favourites')}>Favourites</button>
                {isAdmin && (
                    <button className={styles.headerButton} onClick={() => navigate('all-users')}>All Users</button>
                )}
                <button className={styles.headerButton} onClick={() => navigate('/homepage/my-flats')}>My flats</button>
                <button className={styles.headerButton} onClick={() => navigate('/homepage/add-flats')}>Add flats</button>
                <button className={styles.headerButton} onClick={() => navigate('/homepage/all-flats')}>All flats</button>

                <button className={styles.headerButton} onClick={() => handleLogout()}>Logout</button>
                <button className={styles.deleteAccButton} onClick={() => handleDelete()}>Delete Account</button>
            </header>
        </>
    )
}

export default Header;



