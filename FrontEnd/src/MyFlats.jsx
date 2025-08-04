/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import FlatTable from "./FlatTable";
import { useAuth } from "./hooks/useAuth";
import style from "./MyFlats.module.css"
import api from "./api";



function MyFlats(){

    const { user, isFetching} = useAuth();
    const [flatsInfo, setFlats] = useState([]);

    console.log(user)

    useEffect(() => {
        if(user && user.data && user.data.flats){
            setFlats(user.data.flats);
        }
    }, [user]);

    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchFlats = async () => {
            try {
            const flatDataArray = await Promise.all(
                flatsInfo.map(async (flatID) => {
                    try{
                        const response = await api.get(`/flats/${flatID}`, {
                            headers: {
                                Authorization: `bearer ${user.data.activeToken}`
                            }
                        });
            
                        return response.data.data[0];
                    }catch(error){
                        console.error(`Flat with ID ${flatID} cannot be found`);
                        return null;
                    }
                })
            );
            // console.log(flatDataArray);
            const validFlats = flatDataArray.filter(flat => flat !== undefined);
            setRows(validFlats);
            } catch (error) {
            console.error("Eroare la fetch flats:", error);
            }
        };

        console.log(isFetching);

        if (flatsInfo.length > 0 && !isFetching) {
            fetchFlats();
        }
    }, [flatsInfo]);

    console.log(rows);
    

    // console.log(flatsInfo);
    
    return (
    
        <div className={style.tableDiv}>
            {rows.length > 0 ? <FlatTable rows={rows} setRows={setRows} where={"myFlats"}/> : <div>User has no apartments</div>}
        </div>
        
    )
}

export default MyFlats;


