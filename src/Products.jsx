import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext";
import Cookies from "js-cookie";

const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchProducts = async() => {
        const response = await fetch('http://localhost:3000/products', {
            method: 'GET',
        });

        const data = await response.json();

        if(response.ok){
            setProducts(data.data);
        }else{ 
            console.log('Error fetching products');
        }
    } 

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleProduct = (productId) => {
        if(!user){
            navigate("/signin");
        }else{
            navigate(`product/${productId}`)
        }
    }

    const handleDelete = async(productId) => {
        if(!window.confirm("Are you sure you want to delete this product?")) return;

        try{
            const token = Cookies.get("token");
            const response = await fetch(`http://localhost:3000/deleteProduct/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json();
            if(response.ok){
                alert("Product deleted sucessfully.");
                setProducts(products.filter(product => product.id !== productId));
            }else{
                alert(data.message || "Error deleting product.")
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
       <div>
        <Link to="/homepage">Homepage</Link><br/>
        {user && user.data.role === "admin" && (
            <>
                <Link to="/add-product">Add product</Link><br/>
                <Link to="/reviews">Review List</Link>
            </>
        )}

        {!user && (
            <div>
                <Link to="/register">Register</Link><br/>
                <Link to="/signin">Login</Link>
            </div>
        )}
        <h1>Products</h1>
        {products.length > 0 ? (
            products.map(product => (
                <div key={product.id} style={{border: "1px solid black"}}>
                    <h2>Product Name: {product.title}</h2>
                    <button onClick={() => handleProduct(product.id)}>View product details</button>

                    {user && user.data.role === "admin" && (
                        <>
                            <button onClick={() => navigate(`/edit-product/${product.id}`)}>Edit product</button>
                            <button onClick={() => handleDelete(product.id)}>Delete product</button>
                        </>
                    )}
                </div>
            ))
        ) : <p>Loading products...</p>}
       </div>
    )
}

export default Products;