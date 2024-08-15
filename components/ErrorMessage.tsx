// components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="error-message" role="alert">
            <p>{message}</p>
        </div>
    );
}