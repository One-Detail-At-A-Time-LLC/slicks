
// Unit tests for: ContextMenuShortcut





import { ContextMenuShortcut } from '../../../components/ui/context-menu.tsx';

import { render } from '@testing-library/react';


describe('ContextMenuShortcut() ContextMenuShortcut method', () => {
    // Happy Path Tests
    describe('Happy Path', () => {
        test('should render with default class and props', () => {
            // This test aims to verify that the component renders correctly with default classes and props.
            const { getByText } = render(<ContextMenuShortcut>Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
        });

        test('should render with additional className', () => {
            // This test aims to verify that the component correctly applies additional class names.
            const { getByText } = render(<ContextMenuShortcut className="extra-class">Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground extra-class');
        });

        test('should pass additional props to the span element', () => {
            // This test aims to verify that additional props are correctly passed to the span element.
            const { getByText } = render(<ContextMenuShortcut data-testid="shortcut">Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveAttribute('data-testid', 'shortcut');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        test('should render without children', () => {
            // This test aims to verify that the component can render without children.
            const { container } = render(<ContextMenuShortcut />);
            const element = container.querySelector('span');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
        });

        test('should handle null className gracefully', () => {
            // This test aims to verify that the component handles a null className gracefully.
            const { getByText } = render(<ContextMenuShortcut className={null}>Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
        });

        test('should handle undefined className gracefully', () => {
            // This test aims to verify that the component handles an undefined className gracefully.
            const { getByText } = render(<ContextMenuShortcut className={undefined}>Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
        });

        test('should handle empty string className gracefully', () => {
            // This test aims to verify that the component handles an empty string className gracefully.
            const { getByText } = render(<ContextMenuShortcut className="">Shortcut</ContextMenuShortcut>);
            const element = getByText('Shortcut');
            expect(element).toBeInTheDocument();
            expect(element).toHaveClass('ml-auto text-xs tracking-widest text-muted-foreground');
        });
    });
});

// End of unit tests for: ContextMenuShortcut
