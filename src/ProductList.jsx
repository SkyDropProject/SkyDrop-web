import React, { useEffect } from 'react';
import ProductImage from './components/ProductImage';
import './ProductList.scss';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001'

const ProductList = ({ products }) => {
    const [cart, setCart] = React.useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token;
        axios.get(`${baseUrl}/user/cart`, {
            headers: { token: token}
        })
            .then(res => setCart(res.data))
            .catch(err => console.error('Failed to fetch cart:', err));
    }, []);

    const handleAddToCart = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const token = user.token;
            await axios.put(`${baseUrl}/user/cart`, { productId: productId }, {
                headers: { token: token}
            });
            const res = await axios.get(`${baseUrl}/user/cart`, {
                headers: { token: token}
            });
            setCart(res.data);
        } catch (err) {
            console.error('Failed to add to cart:', err);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const token = user.token;
            await axios.post(`${baseUrl}/user/cart`, { productId: productId }, {
                headers: { token: token}
            });
            // Refresh cart after removing
            const res = await axios.get(`${baseUrl}/user/cart`, {
                headers: { token: token}
            });
            setCart(res.data);
        } catch (err) {
            console.error('Failed to remove from cart:', err);
        }
    };

    const handleValidateCart = async () => {
    }

    if (!products || products.length === 0) {
        return <div className="product-list__empty">No products available.</div>;
    }

    return (
        <>
            <div className='validate-cart' onClick={handleValidateCart}>
                Valider le panier
            </div>
            <div className="product-list">
                {products.map(product => {
                    // Count how many of this product are in the cart
                    const inCartCount = cart.filter(item => item === product._id).length;
                    const stockLeft = product.stock - inCartCount;
                    return (
                        <div
                            key={product._id}
                            className="product-list__item"
                        >
                            <ProductImage
                                imageUrl={product.imageUrl}
                                alt={product.name}
                                className="product-list__image"
                            />
                            <h3 className="product-list__name">{product.name}</h3>
                            <p className="product-list__description">{product.description}</p>
                            <p className="product-list__price">Prix: {product.price}€</p>
                            <p className="product-list__stock">
                                Stock: {product.stock}
                            </p>
                            <p className="product-list__weight">Weight: {product.weight}kg</p>
                            {/* <p className="product-list__category">Category ID: {product.categoryId}</p> */}
                            <p className="product-list__starred">Starred: {product.star ? 'Yes' : 'No'}</p>
                            <div className='flex justify-between align-center'>
                                <button
                                    className='product-list__remove-from-cart'
                                    onClick={() => {
                                        const index = cart.findIndex(item => item === product._id);
                                        if (index !== -1) {
                                            handleRemoveFromCart(product._id);
                                        }
                                    }}
                                    disabled={inCartCount === 0}
                                    style={{ opacity: inCartCount > 0 ? 1 : 0.5 , pointerEvents: inCartCount > 0 ? 'auto' : 'none'}}
                                >-</button>
                                <div className="flex items-center justify-center product-list__cart-count">
                                    {inCartCount}
                                </div>
                                <button
                                    className="product-list__add-to-cart"
                                    onClick={() => {
                                        handleAddToCart(product._id);
                                    }}
                                    disabled={stockLeft <= 0}
                                    style={{ opacity: stockLeft > 0 ? 1 : 0.5, pointerEvents: stockLeft > 0 ? 'auto' : 'none'}}
                                >+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ProductList;