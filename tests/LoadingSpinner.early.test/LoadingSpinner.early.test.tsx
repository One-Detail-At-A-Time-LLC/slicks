
// Unit tests for: LoadingSpinner


import LoadingSpinner from '../../components/LoadingSpinner.tsx';

import { render } from '@testing-library/react';


// File: components/__tests__/LoadingSpinner.test.tsx

// File: components/__tests__/LoadingSpinner.test.tsx
describe('LoadingSpinner() LoadingSpinner method', () => {
    describe('Happy Path', () => {
        test('should render the LoadingSpinner component correctly', () => {
            // This test aims to verify that the LoadingSpinner component renders correctly with the expected structure and classes.
            const { container } = render(<LoadingSpinner />);
            const spinnerContainer = container.querySelector('div.flex.items-center.justify-center.h-screen');
            const spinner = container.querySelector('div.animate-spin.rounded-full.h-32.w-32.border-t-2.border-b-2.border-gray-900');

            expect(spinnerContainer).toBeInTheDocument();
            expect(spinner).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('should have the correct class names for styling', () => {
            // This test aims to verify that the LoadingSpinner component has the correct class names for styling.
            const { container } = render(<LoadingSpinner />);
            const spinner = container.querySelector('div.animate-spin.rounded-full.h-32.w-32.border-t-2.border-b-2.border-gray-900');

            expect(spinner).toHaveClass('animate-spin');
            expect(spinner).toHaveClass('rounded-full');
            expect(spinner).toHaveClass('h-32');
            expect(spinner).toHaveClass('w-32');
            expect(spinner).toHaveClass('border-t-2');
            expect(spinner).toHaveClass('border-b-2');
            expect(spinner).toHaveClass('border-gray-900');
        });

        test('should be centered on the screen', () => {
            // This test aims to verify that the LoadingSpinner component is centered on the screen.
            const { container } = render(<LoadingSpinner />);
            const spinnerContainer = container.querySelector('div.flex.items-center.justify-center.h-screen');

            expect(spinnerContainer).toHaveClass('flex');
            expect(spinnerContainer).toHaveClass('items-center');
            expect(spinnerContainer).toHaveClass('justify-center');
            expect(spinnerContainer).toHaveClass('h-screen');
        });
    });
});

// End of unit tests for: LoadingSpinner
