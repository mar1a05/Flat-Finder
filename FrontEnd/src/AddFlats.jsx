/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import  { useAuth }  from './hooks/useAuth';
import firebase from "firebase/compat/app";
import style from "./AddFlats.module.css"
import api from "./api";


function AddFlats(){
    const {user, setUser, fetchUser} = useAuth();
    // const [uid, setUid] = useState(null);
    
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (authUser) => {
    //         if(authUser){
    //             setUid(authUser.uid);
    //         }else{
    //             setUid(null);
    //         }
    //     })

    //     return () => unsubscribe();
    // }, [])
    // console.log(uid);

    const [flatData, setFlatData] = useState({
        city: '',
        streetName: '',
        streetNumber: '',
        areaSize: '',
        hasAC: false,
        yearBuilt: '',
        price: '',
        dateAvailable: ''
        // messages: []
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
       const {name, value, type, checked} = e.target;
        setFlatData((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const validateNumber = (number) => {
        return number > 0;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(user && validateForm()){
            try{
                // const flatsColection = doc(db, 'users', user.uid);
                // const newFlat = [...flats || [], flatData];
                // await updateDoc(flatsColection, {
                //     flats: newFlat
                // });
                
                // flatData.owner = uid;
                // flatData.ownerEmail = user.email;

                // const flatDocRef = doc(db, 'flats', String(flatData.id)); 
                // await setDoc(flatDocRef, flatData);



                // const response = await api.patch("/users/update", {
                //     userData: updatedUser,
                //     password: "add flat"
                // }, {
                //     headers:{
                //         Authorization: `bearer ${user.data.activeToken}`
                //     }
                // })

                const response = await api.post("/addFlat", {
                    ...flatData
                }, {
                    headers: {
                        Authorization: `bearer ${user.data.activeToken}`
                    }
                })
                fetchUser();
                navigate('/homepage/my-flats');
            }catch(error){
                console.error('Error adding flat', error);
                console.log(error);
            }
        }
    }

    

    const validateForm = () => {
        const newErrors = {};

        if(flatData.city == '')
        {
            newErrors.city = "Required field"; 
        }
        if(flatData.streetName  == '')
        {
            newErrors.streetName = "Required field"; 
        }
        if(flatData.streetNumber  == '')
        {
            newErrors.streetNumber = "Required field"; 
        }
        if(!validateNumber(flatData.streetNumber) && flatData.streetNumber  != '')
        {
            newErrors.streetNumber = "Field cannot be in the negatives";
        }
        if(flatData.areaSize == '')
        {
            newErrors.areaSize = "Required field"; 
        }
        if(!validateNumber(flatData.areaSize) && flatData.areaSize  != '')
        {
            newErrors.streetNumber = "Field cannot be in the negatives";
        }
        if(flatData.yearBuilt == '')
        {
            newErrors.yearBuilt = "Required field"; 
        }
        if(!validateNumber(flatData.yearBuilt) && flatData.yearBuilt != '')
        {
            newErrors.yearBuilt = "Field cannot be in the negatives";
        }
        if(flatData.price == '')
        {
            newErrors.price = "Required field"; 
        }
        if(!validateNumber(flatData.price) && flatData.price != '')
        {
            newErrors.price = "Field cannot be in the negatives";
        }
        if(flatData.dateAvailable == '')
        {
            newErrors.dateAvailable = "Required field"; 
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    }

    const [inputType, setInputType] = useState("text");

    const handleFocus = () => {
        setInputType("date");
    };
    
    const handleBlur = () => {
        setInputType("text");
    };


    return (
        <div className={style.addFlatDiv}>
            <form onSubmit={handleSubmit} className={style.addFlatCard}>
                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="text" name="city" value={flatData.city} onChange={handleChange} placeholder="City"/>
                    {errors.city && <p className={style.addFlatError}>{errors.city}</p>}
                </div>

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="text" name="streetName" value={flatData.streetName} onChange={handleChange} placeholder="Street name"/>
                    {errors.streetName && <p className={style.addFlatError}>{errors.streetName}</p>}
                </div>

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="number" name="streetNumber" value={flatData.streetNumber} onChange={handleChange} placeholder="Street number"/>
                    {errors.streetNumber && <p className={style.addFlatError}>{errors.streetNumber}</p>}
                </div>

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="number" name="areaSize" value={flatData.areaSize} onChange={handleChange} placeholder="Area size"/>
                    {errors.areaSize && <p className={style.addFlatError}>{errors.areaSize}</p>}
                </div>    

                <div className={style.addFlatInputDiv}>
                    <p>Has AC:</p>
                    <input className={style.addFlatInput} type="checkbox" name="hasAC" checked={flatData.hasAC} onChange={handleChange} />
                    {errors.hasAc && <p className={style.addFlatError}>{errors.hasAc}</p>}
                </div>

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="number" name="yearBuilt" value={flatData.yearBuilt} onChange={handleChange} placeholder="Year built"/>
                    {errors.yearBuilt && <p className={style.addFlatError}>{errors.yearBuilt}</p>}
                </div>    

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type="number" name="price" value={flatData.price} onChange={handleChange} placeholder="Rent price"/>
                    {errors.price && <p className={style.addFlatError}>{errors.price}</p>}
                </div>

                <div className={style.addFlatInputDiv}>
                    <input className={style.addFlatInput} type={inputType} name="dateAvailable" value={flatData.dateAvailable} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}  placeholder="Date available"/>
                    {errors.dateAvailable && <p className={style.addFlatError}>{errors.dateAvailable}</p>}
                </div>   

                <button className={style.addFlatButton} type="submit">Add flat</button>
            </form>
        </div>
    )
}

export default AddFlats