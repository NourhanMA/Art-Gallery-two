import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductsPage from './components/ProductsPage';
import WishlistPage from './components/WishlistPage';
import Homepage from './components/HomePage';
import Footer from './components/Footer';

import Cart from './components/Cart/Cart';
import CartContext from './components/Cart/CartContext';
import Checkout from './components/Checkout/Checkout'

// import AuthContext, { AuthProvider } from './authGuard/AuthContext';
// import AuthGuard from './authGuard/AuthGuard';
// import Login from './components/Login';
function App() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');



    const handleAddToWishlist = (product) => {
        setWishlistItems((prevItems) => [...prevItems, product]);
        setWishlistCount(wishlistCount + 1);
    };

    const handleRemoveFromWishlist = (product) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
        setWishlistCount(wishlistCount - 1);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const { cart, dispatch } = useContext(CartContext);

    const handleAddToCart = (product) => {
        console.log(product)

        const existingCartItem = cart.find(item => item._id === product._id);
        console.log(existingCartItem)
        if (existingCartItem) {
            const id = product._id
            const newQuantity = product.quantity + existingCartItem.quantity
            if (newQuantity <= product.stock) {
                dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
                setCartCount(cartCount + product.quantity);
            }
            else {
                alert(`Cannot add more than ${product.stock} items to the cart.`);
            }

        } else {
            if (product.quantity <= product.stock) {
                dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: product.quantity } });
                setCartCount(cartCount + product.quantity);
            } else {
                alert(`Cannot add more than ${product.stock} items to the cart.`);
            }
        }
    };


    return (
        // <AuthProvider>

        <Router>
            <div className="App">
                <Header
                    cartCount={cartCount}
                    wishlistCount={wishlistCount}
                    onSearch={handleSearch}
                />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route
                        path="/products"
                        element={<ProductsPage
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            searchQuery={searchQuery}
                        />}
                    />
                    <Route
                        path="/wishlist"
                        element={<WishlistPage
                            wishlistItems={wishlistItems}
                            onAddToCart={handleAddToCart}
                            onRemoveFromWishlist={handleRemoveFromWishlist}
                        />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    {/* <Route path="/login" element={<Login />} /> */}

                </Routes>
                <Footer />
            </div>
        </Router>
        // </AuthProvider>
    );
}

export default App;

