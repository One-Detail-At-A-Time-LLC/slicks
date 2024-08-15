
// Unit tests for: DropdownMenuShortcut





import { DropdownMenuShortcut } from '../../../components/ui/dropdown-menu.tsx';

import { render } from '@testing-library/react';


describe('DropdownMenuShortcut() DropdownMenuShortcut method', () => {
    // Happy path tests
    describe('Happy Path', () => {
        test('should render with default class and props', () => {
            // This test aims to verify that the component renders correctly with default props.
            const { getByText } = render(<DropdownMenuShortcut>Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest opacity-60');
        });

        test('should render with additional className', () => {
            // This test aims to verify that the component correctly applies additional class names.
            const { getByText } = render(<DropdownMenuShortcut className="extra-class">Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest opacity-60 extra-class');
        });

        test('should pass additional props to the span element', () => {
            // This test aims to verify that additional props are passed to the span element.
            const { getByText } = render(<DropdownMenuShortcut data-testid="shortcut">Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveAttribute('data-testid', 'shortcut');
        });
    });

    // Edge case tests
    describe('Edge Cases', () => {
        test('should render without children', () => {
            // This test aims to verify that the component can render without children.
            const { container } = render(<DropdownMenuShortcut />);
            expect(container.firstChild).toBeInTheDocument();
            expect(container.firstChild).toHaveClass('ml-auto text-xs tracking-widest opacity-60');
        });

        test('should handle null className gracefully', () => {
            // This test aims to verify that the component handles a null className gracefully.
            const { getByText } = render(<DropdownMenuShortcut className={null}>Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest opacity-60');
        });

        test('should handle undefined className gracefully', () => {
            // This test aims to verify that the component handles an undefined className gracefully.
            const { getByText } = render(<DropdownMenuShortcut className={undefined}>Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest opacity-60');
        });

        test('should handle empty string className gracefully', () => {
            // This test aims to verify that the component handles an empty string className gracefully.
            const { getByText } = render(<DropdownMenuShortcut className="">Shortcut</DropdownMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest opacity-60');
        });
    });
});

// End of unit tests for: DropdownMenuShortcut
