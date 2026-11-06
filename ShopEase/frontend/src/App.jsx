import MyOrders from "./pages/MyOrders";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Checkout from "./pages/Checkout";
import "./App.css";
const categories = ["All", "Electronics", "Fashion", "Shoes", "Accessories"];
function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState(() => {
  return JSON.parse(localStorage.getItem("cart")) || [];
});
  const [showCart, setShowCart] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.error(err);
        setError("Unable to load products. Please check your backend.");
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
  

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const productCategory = product.category.toLowerCase();
      const selectedCategory = category.toLowerCase();

      const matchesCategory =
        category === "All" ||
        productCategory === selectedCategory ||
        (selectedCategory === "shoes" && productCategory === "footwear");

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return previousCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    setShowCart(true);
  };

  const updateQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item._id !== id)
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="shop-app">
      <div className="top-strip">
        Free delivery on orders above ₹999 | Shop your favourites today!
      </div>

      <header className="navbar">
        <a href="/" className="logo">
          <span className="logo-icon">S</span>
          ShopEase<span className="logo-dot">.</span>
        </a>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              scrollToProducts();
            }}
          />
          <button onClick={scrollToProducts}>⌕</button>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#products">Shop</a>
          <a href="#footer">Contact</a>
        </nav>

        <button className="cart-button" onClick={() => setShowCart(true)}>
          🛒 Cart <span>{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="hero-label">YOUR EVERYDAY SHOPPING DESTINATION</span>
            <h1>
              Discover products
              <br />
              you'll <span>love.</span>
            </h1>
            <p>
              Explore the latest trends, everyday essentials and
              amazing deals — all in one place.
            </p>
            <button className="primary-button" onClick={scrollToProducts}>
              Explore Products →
            </button>
            <div className="hero-note">
              ✓ Great choices &nbsp; ✓ Easy shopping &nbsp; ✓ COD available
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-circle"></div>
            <div className="hero-emoji">🛍️</div>
            <div className="floating-card">
              <span>✨</span>
              <div>
                <strong>Something for everyone</strong>
                <small>Find your next favourite</small>
              </div>
            </div>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BROWSE COLLECTIONS</span>
              <h2>Shop by category</h2>
            </div>
          </div>

          <div className="category-grid">
            {[
              { name: "Electronics", icon: "🎧", color: "blue" },
              { name: "Fashion", icon: "👕", color: "pink" },
              { name: "Shoes", icon: "👟", color: "orange" },
              { name: "Accessories", icon: "⌚", color: "green" },
            ].map((item) => (
              <button
                className={`category-card ${item.color}`}
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  scrollToProducts();
                }}
              >
                <span className="category-icon">{item.icon}</span>
                <strong>{item.name}</strong>
                <span className="category-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading product-heading">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2>Explore our products</h2>
              <p>Find something special for yourself.</p>
            </div>
          </div>

          <div className="filter-row">
            <div className="category-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "filter active" : "filter"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="result-count">
              {filteredProducts.length} products
            </span>
          </div>

          {loading && <p className="message">Loading products...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="message">No products found. Try another search.</p>
          )}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/500x400?text=ShopEase";
                    }}
                  />
                  <span className="product-category">{product.category}</span>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="price-row">
                    <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                    <span>Stock: {product.stock}</span>
                  </div>

                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock <= 0 ? "Out of Stock" : "+ Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bottom-banner">
          <div>
            <span className="eyebrow">SHOP SMART. LIVE BETTER.</span>
            <h2>Your next favourite is waiting.</h2>
            <p>Discover great products at ShopEase.</p>
          </div>
          <button onClick={scrollToProducts}>Start Shopping →</button>
        </section>
      </main>

      <footer id="footer">
        <a href="/" className="logo footer-logo">
          <span className="logo-icon">S</span>
          ShopEase<span className="logo-dot">.</span>
        </a>
        <p>Your everyday shopping destination.</p>
        <p className="copyright">
          © 2026 ShopEase. All rights reserved.
        </p>
      </footer>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <aside className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Shopping Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setShowCart(false);
                    scrollToProducts();
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item._id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>₹{item.price}</span>
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item._id, -1)}>
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            disabled={item.quantity >= item.stock}
                            onClick={() => updateQuantity(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-button"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Total Amount</span>
                    <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <p>Delivery and payment details will be added in checkout.</p>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => {
  localStorage.setItem("cart", JSON.stringify(cart));
  setShowCart(false);
  navigate("/checkout");
}}
                  >
                    Continue to Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;