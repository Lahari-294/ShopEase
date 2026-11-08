import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("customerPhone");

    if (!phone) {
      setError("Please place an order first.");
      setLoading(false);
      return;
    }

    axios
      .get(`https://shopease-backend-2rjx.onrender.com/api/orders/my/${phone}`)
      .then((response) => setOrders(response.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load your orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-orders-page">
      <button onClick={() => navigate("/")}>← Back to Shop</button>

      <h1>My Orders</h1>
      <p>View your previous purchases here.</p>

      {loading && <p>Loading your orders...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div>
          <h2>No orders found</h2>
          <button onClick={() => navigate("/")}>Start Shopping</button>
        </div>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>
            Date: {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
          <p>Customer: {order.customerName}</p>
          <p>Phone: {order.phone}</p>
          <p>Address: {order.address}, {order.city} - {order.pincode}</p>

          <h4>Products</h4>

          {order.items.map((item, index) => (
            <div className="order-product" key={index}>
              <span>{item.name} × {item.quantity}</span>
              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <hr />

          <h3>
            Total: ₹{order.totalAmount.toLocaleString("en-IN")}
          </h3>
          <p>Payment: Cash on Delivery</p>
          <p>Order Status: {order.orderStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;