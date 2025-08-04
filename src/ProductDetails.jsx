import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ReviewForm from './ReviewForm';

const ProductDetails = () => {
    const { id } = useParams();
    const [ product, setProduct ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const token = Cookies.get("token");
                const response = await fetch(`http://localhost:3000/products/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })

                const data = await response.json();
                if(response.ok){
                    setProduct(data.data);
                }else{
                    console.log("Error fetching product", data.message);
                }
            }catch(err) {
                console.error("Error", err);
            }
        }
        fetchProduct();
    }, [id])

    if(!product){
        return <p>No product info found!</p>
    }

    return (
        <div>
            {product.map((element) => (
                <div key={element.id}>
                    <h1>Product Details</h1>
                    <h2>Title: {element.title}</h2>
                    <p>Description: {element.description}</p>
                    <p>Price: {element.price}</p>
                    <p>Created By: {element.createdBy?.name || "Unknown"}</p>


                    <h3>Reviews:</h3>
                    <ReviewForm productId={id}/>


                    <button onClick={() => navigate("/")}>Back to products</button>
                </div>
            ))}
            
        </div>
    )
}

export default ProductDetails;