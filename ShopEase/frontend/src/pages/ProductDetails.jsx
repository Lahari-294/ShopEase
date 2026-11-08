import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`https://shopease-backend-2rjx.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return <h2>Loading product...</h2>;
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
  };

  return (
    <div className="product-details">
      <button onClick={() => navigate("/")}>← Back to Home</button>

      <div className="details-container">
        <img
          src={product.image || "https://placehold.co/400"}
          alt={product.name}
        />

        <div>
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>
          <p>{product.description || "No description available."}</p>
          <p>Category: {product.category}</p>
          <p>Available Stock: {product.stock}</p>

          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(product.stock, Number(e.target.value) || 1))
              )
            }
          />

          <br /><br />
          <button onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;