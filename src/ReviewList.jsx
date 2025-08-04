import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ReviewList = () => {
    const token = Cookies.get("token");
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchReviews = async() => {
            try{
                const response = await fetch("http://localhost:3000/reviews", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${token}`
                    }
                })
    
                const data = await response.json();
                if(response.ok){
                    setReviews(data.data);
                }
            }catch(err){
                console.log(err);
            }
        }
        fetchReviews();
    }, [])

    return (
        <div>
            {reviews.map((rev) => (
                <div key={rev._id}>
                    <h2>Description: {rev.description}</h2>
                    <p>Rating: {rev.rating}</p>
                    <p>Product: {rev.productId.title}</p>
                    <p>User: {rev.userId?.name || "Unknown"}</p>
                </div>
            ))}
        </div>
    )
}

export default ReviewList;