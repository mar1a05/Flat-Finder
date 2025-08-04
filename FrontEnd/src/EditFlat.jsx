/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom"
import { useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "./hooks/useAuth";
import style from "./EditFlat.module.css"
import api from "./api";


function EditFlat() {

    const {user} = useAuth();

    const navigate = useNavigate();
    const {flatID} = useParams();
    const location = useLocation();
    const [userFlats, setUserFlats] = useState([]);

    const [flatData, setFlatData] = useState({});


    useEffect(()=> {
        const getFlatData = async() => {
            if(user){
                // const currentFlat = flats.find((flat) => {
                //      return flat.id == flatID;                  
                // });
    
                // if(currentFlat) 
                //     setFlatData(currentFlat);
    
                const response = await api.get(`/flats/${flatID}`, {
                    headers:{
                        Authorization: `bearer ${user.data.activeToken}`
                    }
                })

                setFlatData(response.data.data[0])
    
                return response.data.data[0]
            }
        }

        getFlatData();

    }, [flatID]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
         setFlatData((previous) => ({
             ...previous,
             [name]: type === 'checkbox' ? checked : value,
         }))
    }



    const handleSubmit = async(e) => {
        e.preventDefault();

        if(user){
            try{
                // const flatsColection = doc(db, 'users', user.uid);
                // const updatedFlat = flats.map((flat) => {
                //     console.log(flat)
                //     return flat.id == flatID ? {...flatData} : flat;
                // })
                // await updateDoc(flatsColection, {
                //     flats: updatedFlat
                // })

                const response = api.patch(`/updateFlat/${flatID}`,{
                    data: flatData
                }, {
                    headers: {
                        Authorization: `bearer ${user.data.activeToken}`
                    }

                })

                navigate('/homepage/my-flats');
            }catch(error){
                console.error("Error editing flat", error);
            }
        }
    }

    const [inputType, setInputType] = useState("text");
   
    const handleFocus = () => {
        setInputType("date");
    };
    
    const handleBlur = () => {
        setInputType("text");
    };

  return (

    <div className={style.editFlatDiv}>
            <form onSubmit={handleSubmit} className={style.editFlatCard}>
                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="text" name="city" value={flatData.city} onChange={handleChange} placeholder="City"/>
                </div>

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="text" name="streetName" value={flatData.streetName} onChange={handleChange} placeholder="Street name"/>
                </div>

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="number" name="streetNumber" value={flatData.streetNumber} onChange={handleChange} placeholder="Street number"/>
                </div>

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="number" name="areaSize" value={flatData.areaSize} onChange={handleChange} placeholder="Area size"/>
                </div>    

                <div className={style.editFlatInputDiv}>
                    <p>Has AC:</p>
                    <input className={style.editFlatInput} type="checkbox" name="hasAC" checked={flatData.hasAC} onChange={handleChange} />
                </div>

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="number" name="yearBuilt" value={flatData.yearBuilt} onChange={handleChange} placeholder="Year built"/>
                </div>    

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type="number" name="price" value={flatData.price} onChange={handleChange} placeholder="Rent price"/>
                </div>

                <div className={style.editFlatInputDiv}>
                    <input className={style.editFlatInput} type={inputType} name="dateAvailable" value={flatData.dateAvailable} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}  placeholder="Date available"/>
                </div>   

                <button className={style.editFlatButton} type="submit">Edit flat</button>
            </form>
        </div>
  )
}

export default EditFlat