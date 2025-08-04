/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import FlatTable from "./FlatTable";
import style from "./Favourites.module.css";
import axios from "axios";
import api from "./api";




function Favourites() {

  const {user, fetchUser} = useAuth();
  const [favouriteFlats, setFavouriteFlats] = useState([]);

  useEffect(() => {
    if(user && user.data && user.data.favouriteFlats){
        setFavouriteFlats(user.data.favouriteFlats);
    }
  }, [user]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchFlats = async () => {
        try {
        const flatDataArray = await Promise.all(
          favouriteFlats.map(async (flatID) => {
            try{
                const response = await api.get(`/flats/${flatID}`, {
                    headers: {
                        Authorization: `bearer ${user.data.activeToken}`
                    }
                });

                console.log(response);
    
                return response.data.data[0];
            }catch(error){
                console.error(`Flat with ID ${flatID} cannot be found`);
                console.error(error);

                return null;
            }
            })
        );
        // console.log(flatDataArray);
        const validFlats = flatDataArray.filter(flat => flat !== null);
        setRows(validFlats);
        } catch (error) {
        console.error("Eroare la fetch flats:", error);
        }
    };

    if (favouriteFlats.length > 0) {
        fetchFlats();
    }
  }, [favouriteFlats]);

    console.log(rows);

    // useEffect(()=>{
    //     if(flats){
    //         const favouriteFlats = flats.filter(flat => flat.isFavourite);
    //         setFavouriteFlats(favouriteFlats);
    //     }
    // }, [favouriteFlats, flats]);

    // useEffect(() => {
    //   fetchFavs();
    // })

  return (
    <div className={style.favouritesTableDiv}>
        <FlatTable rows={rows} setRows={setRows} where={"favourites"}/>
    </div>
        
  )
}

export default Favourites