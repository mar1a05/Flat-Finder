// import { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { useAuth } from "../hooks/useAuth";

// function AdminRoute() {  
//     const [role, setRole] = useState('');
//     const [loading, setLoading] = useState(true); 
//     const [user, setUser, fetchUser] = useAuth();
    

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (authUser) => {
//             if (authUser) {
//                 const fetchUserData = async () => {
//                     try {
//                         const userDoc = doc(db, 'users', authUser.uid);
//                         const userSnapshot = await getDoc(userDoc);
//                         if (userSnapshot.exists()) {
//                             const userData = userSnapshot.data();
//                             const roleUser = userData.role;
//                             setRole(roleUser);
//                         } else {
//                             setRole(''); 
//                         }
//                     } catch (error) {
//                         console.error('Error fetching user data:', error);
//                     } finally {
//                         setLoading(false); 
//                     }
//                 };

//                 fetchUserData();
//             } else {
//                 setRole(''); 
//                 setLoading(false); 
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     const isAdmin = role === 'admin';

//     return isAdmin ? <Outlet/> : <Navigate to='/homepage/my-flats' />; 
// }

// export default AdminRoute;



import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function AdminRoute() {
    const { user, isFetching } = useAuth();

    if (isFetching) {
        return <div>Loading...</div>;
    }

    console.log(user.data);

    

    return user.data.isAdmin ? <Outlet /> : <Navigate to="/homepage/my-flats" />;
}

export default AdminRoute;

