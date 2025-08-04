/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import FlatTable from "./FlatTable";
import AllFlatsTable from "./AllFlatsTable";
import { useAuth } from "./hooks/useAuth";
import style from "./AllFlats.module.css"
import api from "./api";

function AllFlats() {

  

  const [allFlats, setAllFlats] = useState([]);
  const {user} = useAuth();
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // const querySnapshot = await getDocs(collection(db, "flats"));
          // const result = querySnapshot.docs.map((doc) => ({
          //     id: doc.id,
          //     ...doc.data(), 
          //   })).filter((flat) => flat.owner !== user.uid); 
          // setAllFlats(result);
          const response = await api.get("/flats");

          console.log(response.data.data);

          setAllFlats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData();
  }, [user]);


  const rows = [...allFlats];

  return (
    <div className={style.allFlatsTableDiv}>
      <AllFlatsTable rows = {rows} />

    </div>
  )

  
}

export default AllFlats