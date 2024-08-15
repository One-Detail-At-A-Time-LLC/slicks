
// Unit tests for: DialogHeader




import { cn } from "@/lib/utils";

import { DialogHeader } from '../../../components/ui/dialog.tsx';

import { render } from '@testing-library/react';


jest.mock("@/lib/utils", () => ({
    cn: jest.fn(),
}));

describe('DialogHeader() DialogHeader method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Path', () => {
        test('renders correctly with default props', () => {
            // Arrange
            const { container } = render(<DialogHeader />);

            // Assert
            expect(container.firstChild).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
        });

        test('renders correctly with additional className', () => {
            // Arrange
            const className = 'additional-class';
            const { container } = render(<DialogHeader className={className} />);

            // Assert
            expect(container.firstChild).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
            expect(container.firstChild).toHaveClass(className);
        });

        test('renders correctly with additional props', () => {
            // Arrange
            const dataTestId = 'dialog-header';
            const { getByTestId } = render(<DialogHeader data-testid={dataTestId} />);

            // Assert
            expect(getByTestId(dataTestId)).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('handles null className gracefully', () => {
            // Arrange
            const { container } = render(<DialogHeader className={null as any} />);

            // Assert
            expect(container.firstChild).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
        });

        test('handles undefined className gracefully', () => {
            // Arrange
            const { container } = render(<DialogHeader className={undefined} />);

            // Assert
            expect(container.firstChild).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
        });

        test('handles empty className gracefully', () => {
            // Arrange
            const { container } = render(<DialogHeader className="" />);

            // Assert
            expect(container.firstChild).toHaveClass('flex flex-col space-y-1.5 text-center sm:text-left');
        });

        test('handles additional props correctly', () => {
            // Arrange
            const dataTestId = 'dialog-header';
            const { getByTestId } = render(<DialogHeader data-testid={dataTestId} />);

            // Assert
            expect(getByTestId(dataTestId)).toBeInTheDocument();
        });

        test('calls cn utility function with correct arguments', () => {
            // Arrange
            const className = 'additional-class';
            render(<DialogHeader className={className} />);

            // Assert
            expect(cn).toHaveBeenCalledWith(
                'flex flex-col space-y-1.5 text-center sm:text-left',
                className
            );
        });
    });
});

// End of unit tests for: DialogHeader
