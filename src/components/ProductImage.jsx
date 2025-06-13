import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001'

const ProductImage = ({ imageUrl, alt = 'Product Image', ...props }) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!imageUrl) return;
        const fetchImage = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const token = user.token;
                if(!token) {
                    setError(true);
                    return;
                }
                const response = await axios.get(`${baseUrl}/uploads/${imageUrl}`, {
                    responseType: 'blob',
                    headers: {
                        token: token
                    },
                });
                const url = URL.createObjectURL(response.data);
                setImgSrc(url);
            } catch (err) {
                setError(true);
            }
        };
        fetchImage();
        // Cleanup object URL on unmount
        return () => {
            if (imgSrc) URL.revokeObjectURL(imgSrc);
        };
        // eslint-disable-next-line
    }, [imageUrl]);

    if (error) return <div>Image failed to load.</div>;
    if (!imgSrc) return <div>Loading image...</div>;

    return <img src={imgSrc} alt={alt} {...props} />;
};

export default ProductImage;