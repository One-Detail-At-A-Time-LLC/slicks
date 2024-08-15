
// Unit tests for: ErrorMessage


import { ErrorMessage } from '../../components/ErrorMessage.tsx';

import { render, screen } from '@testing-library/react';


// __tests__/ErrorMessage.test.tsx

// __tests__/ErrorMessage.test.tsx
describe('ErrorMessage() ErrorMessage method', () => {
    // Happy Path Tests
    describe('Happy Path', () => {
        test('should render the error message correctly', () => {
            // Arrange: Define the error message
            const message = 'An error has occurred';

            // Act: Render the ErrorMessage component
            render(<ErrorMessage message={message} />);

            // Assert: Check if the message is displayed correctly
            expect(screen.getByRole('alert')).toHaveTextContent(message);
        });

        test('should have the correct class name', () => {
            // Arrange: Define the error message
            const message = 'An error has occurred';

            // Act: Render the ErrorMessage component
            render(<ErrorMessage message={message} />);

            // Assert: Check if the component has the correct class name
            expect(screen.getByRole('alert')).toHaveClass('error-message');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        test('should render an empty message when message is an empty string', () => {
            // Arrange: Define an empty error message
            const message = '';

            // Act: Render the ErrorMessage component
            render(<ErrorMessage message={message} />);

            // Assert: Check if the component renders an empty message
            expect(screen.getByRole('alert')).toHaveTextContent(message);
        });

        test('should render a very long error message correctly', () => {
            // Arrange: Define a very long error message
            const message = 'A'.repeat(1000);

            // Act: Render the ErrorMessage component
            render(<ErrorMessage message={message} />);

            // Assert: Check if the long message is displayed correctly
            expect(screen.getByRole('alert')).toHaveTextContent(message);
        });

        test('should handle special characters in the error message', () => {
            // Arrange: Define an error message with special characters
            const message = '<script>alert("error")</script>';

            // Act: Render the ErrorMessage component
            render(<ErrorMessage message={message} />);

            // Assert: Check if the message with special characters is displayed correctly
            expect(screen.getByRole('alert')).toHaveTextContent(message);
        });
    });
});

// End of unit tests for: ErrorMessage
