// src/components/FlashMessage.js
import React, { useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';

const FlashMessage = () => {
    const { message, hideMessage } = useAlert();

    useEffect(() => {
        if (message) {
            const timeout = setTimeout(() => hideMessage(), 5000);  // Ocultar después de 5 segundos
            return () => clearTimeout(timeout);
        }
    }, [message, hideMessage]);

    if (!message) return null;

    return (
        <div className="flash-message">
            <p>{message}</p>
        </div>
    );
};

export default FlashMessage;
