// import { useEffect, useState } from "react";
import UsersTable from "./UsersTable"
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import style from "./AllUsers.module.css"
import api from "../api";
import { useAuth } from "../hooks/useAuth";


function AllUsers() {
  const [usersData, setUsersData] = useState([]);
  const {user} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const querySnapshot = await getDocs(collection(db, "users"));
        // const result = querySnapshot.docs.map(doc => ({
        //   id: doc.id,     
        //   ...doc.data()    
        // }));
        // setUsersData(result);

          const response = await api.get('/users', {
          headers:{
            Authorization: `bearer ${user.data.activeToken}`
          }
        })

        console.log(response)
        const usersWithId = response.data.data.map(user => ({
          id: user._id,
          ...user
        }))
        setUsersData(usersWithId)
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData();
  }, []);


    console.log(usersData);

    const rows = [...usersData];

  return (
      <div className={style.allUsersDiv}>
        <UsersTable rows={rows}/>
      </div>
  )
}

export default AllUsers