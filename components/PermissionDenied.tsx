// components/PermissionDenied.tsx
import React from 'react';

interface PermissionDeniedProps {
    requiredRole: string;
}

export function PermissionDenied({ requiredRole }: PermissionDeniedProps) {
    return (
        <div className="permission-denied">
            <h2>Access Denied</h2>
            <p>You don't have the required permissions to view this page.</p>
            <p>Required role: {requiredRole}</p>
        </div>
    );
}
