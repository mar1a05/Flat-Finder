import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const EditProduct = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        created: "",
        createdBy: "",
        reviews: []
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const token = Cookies.get("token");
                const response = await fetch(`http://localhost:3000/products/${id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${token}`
                    }
                })

                const data = await response.json();
                if(response.ok){
                    setProduct(data.data[0]);
                }else{
                    alert("Error fetching product details.");
                }
            }catch(err){
                console.error(err);
            }
        }
        fetchProduct();
    }, [id])

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const token = Cookies.get("token");
            const response = await fetch(`http://localhost:3000/updateProduct/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
                },
                body: JSON.stringify(product)
            })

            const data = await response.json();
            if(response.ok){
                alert("Product updated successfully");
                navigate("/");
            }else{
                alert(data.message || "Error updating product");
            }
        }catch(err){
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={product.title} onChange={handleChange}/>
                <input type="text" name="description" placeholder="Description" value={product.description}onChange={handleChange}/>
                <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange}/>
                <button type="submit">Update product</button>
            </form>
        </div>
    )
}

export default EditProduct;