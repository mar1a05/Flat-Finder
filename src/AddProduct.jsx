import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        title: "",
        description: "",
        price: "",
    })

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const token = Cookies.get("token");
            const response = await fetch('http://localhost:3000/addProduct', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${token}`
                },
                body: JSON.stringify(productData)
            })

            const data = await response.json();

            if(response.ok){
                alert("Product added succesfully!");
                navigate("/");
            }else{
                alert(data.message || "Error adding product");
            }
        }catch(err){
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={productData.title} onChange={handleChange}/>
                <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleChange}/>
                <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleChange}/>
                <button type="submit">Add Product</button>
            </form><br/><br/>
            <button onClick={() => navigate("/")}>Back to products</button>
        </div>
    )
}

export default AddProduct;