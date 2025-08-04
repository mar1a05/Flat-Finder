/* eslint-disable react/prop-types */
import { useState } from "react";
import {useAuth} from "./contexts/AuthContext";
import Cookies from "js-cookie";

const ReviewForm = ( {productId} ) => {
    const [rating, setRating] = useState(1);
    const [description, setDescription] = useState("");
    const { user } = useAuth();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const token = Cookies.get("token");
        const response = await fetch("http://localhost:3000/addReview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `bearer ${token}`
            },
            body: JSON.stringify({
                rating,
                description,
                productId,
                userId: user.data._id
            })
        })

        const data = await response.json();

        if(response.ok){
            alert("Review added.");
            setRating(1);
            setDescription("");
        }else{
            alert(data.message || "Error adding review")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="number" name="rating" placeholder="Rating" value={rating} onChange={(e) => setRating(e.target.value)}/>
                <input type="text" name="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit">Post review</button>
            </form>
        </div>
    )
}

export default ReviewForm;