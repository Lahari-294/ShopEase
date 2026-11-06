import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    navigate("/");
    return;
  }

  try {
    setLoading(true);

    const orderData = {
      ...form,
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
    };

    const response = await axios.post(
      "http://localhost:5000/api/orders",
      orderData
    );

    localStorage.setItem("customerPhone", form.phone);
    localStorage.removeItem("cart");

    alert(
      "🎉 Order Placed Successfully!\n\n" +
      "Order ID: " + response.data.order._id +
      "\nPayment Method: Cash on Delivery (COD)" +
      "\n\nPlease pay when your order is delivered."
    );

    navigate("/my-orders");

  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
      "Unable to place order. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Shop
      </button>

      <h1>Checkout</h1>
      <p className="checkout-subtitle">
        Complete your details to place your order.
      </p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery Details</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="customerName"
            placeholder="Enter your full name"
            value={form.customerName}
            onChange={handleChange}
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter 10 digit mobile number"
            pattern="[0-9]{10}"
            maxLength="10"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Full Address</label>
          <textarea
            name="address"
            placeholder="House number, street, area"
            value={form.address}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <label>PIN Code</label>
          <input
            type="text"
            name="pincode"
            placeholder="Enter 6 digit PIN code"
            pattern="[0-9]{6}"
            maxLength="6"
            value={form.pincode}
            onChange={handleChange}
            required
          />

          <h2>Payment Method</h2>

          <div className="payment-option">
            <input
              type="radio"
              name="payment"
              checked
              readOnly
            />
            <div>
              <strong>Cash on Delivery (COD)</strong>
              <p>Pay when your order is delivered.</p>
            </div>
          </div>

          <button
            type="submit"
            className="place-order-button"
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="summary-item" key={item._id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total Amount</span>
            <strong>
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <p className="cod-note">
            ✓ Cash on Delivery available
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;