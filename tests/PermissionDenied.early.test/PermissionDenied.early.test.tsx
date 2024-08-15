
// Unit tests for: PermissionDenied


import { PermissionDenied } from '../../components/PermissionDenied.tsx';

import { render, screen } from '@testing-library/react';


// components/PermissionDenied.test.tsx

// components/PermissionDenied.test.tsx
describe('PermissionDenied() PermissionDenied method', () => {
    // Happy Path Tests
    describe('Happy Path', () => {
        test('should render the component with the correct required role', () => {
            // Arrange: Render the component with a sample required role
            const requiredRole = 'Admin';
            render(<PermissionDenied requiredRole={requiredRole} />);

            // Assert: Check if the required role is displayed correctly
            expect(screen.getByText('Access Denied')).toBeInTheDocument();
            expect(screen.getByText("You don't have the required permissions to view this page.")).toBeInTheDocument();
            expect(screen.getByText(`Required role: ${requiredRole}`)).toBeInTheDocument();
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        test('should handle an empty required role gracefully', () => {
            // Arrange: Render the component with an empty required role
            const requiredRole = '';
            render(<PermissionDenied requiredRole={requiredRole} />);

            // Assert: Check if the component still renders correctly
            expect(screen.getByText('Access Denied')).toBeInTheDocument();
            expect(screen.getByText("You don't have the required permissions to view this page.")).toBeInTheDocument();
            expect(screen.getByText('Required role: ')).toBeInTheDocument();
        });

        test('should handle a very long required role gracefully', () => {
            // Arrange: Render the component with a very long required role
            const requiredRole = 'A'.repeat(1000);
            render(<PermissionDenied requiredRole={requiredRole} />);

            // Assert: Check if the component still renders correctly
            expect(screen.getByText('Access Denied')).toBeInTheDocument();
            expect(screen.getByText("You don't have the required permissions to view this page.")).toBeInTheDocument();
            expect(screen.getByText(`Required role: ${requiredRole}`)).toBeInTheDocument();
        });

        test('should handle special characters in the required role', () => {
            // Arrange: Render the component with special characters in the required role
            const requiredRole = '!@#$%^&*()_+';
            render(<PermissionDenied requiredRole={requiredRole} />);

            // Assert: Check if the component still renders correctly
            expect(screen.getByText('Access Denied')).toBeInTheDocument();
            expect(screen.getByText("You don't have the required permissions to view this page.")).toBeInTheDocument();
            expect(screen.getByText(`Required role: ${requiredRole}`)).toBeInTheDocument();
        });
    });
});

// End of unit tests for: PermissionDenied
