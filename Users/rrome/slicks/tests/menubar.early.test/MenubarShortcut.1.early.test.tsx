// Unit tests for: MenubarShortcut

import { MenubarShortcut } from "../../../components/ui/menubar.tsx";

import { render } from "@testing-library/react";

describe("MenubarShortcut() MenubarShortcut method", () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    test("should render the MenubarShortcut component with default props", () => {
      // Arrange & Act
      const { getByText } = render(<MenubarShortcut>Shortcut</MenubarShortcut>);

      // Assert
      const shortcutElement = getByText("Shortcut");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground",
      );
    });

    test("should render the MenubarShortcut component with additional className", () => {
      // Arrange & Act
      const { getByText } = render(
        <MenubarShortcut className="additional-class">
          Shortcut
        </MenubarShortcut>,
      );

      // Assert
      const shortcutElement = getByText("Shortcut");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground additional-class",
      );
    });

    test("should pass additional props to the MenubarShortcut component", () => {
      // Arrange & Act
      const { getByText } = render(
        <MenubarShortcut data-testid="shortcut-element">
          Shortcut
        </MenubarShortcut>,
      );

      // Assert
      const shortcutElement = getByText("Shortcut");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveAttribute(
        "data-testid",
        "shortcut-element",
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should render the MenubarShortcut component with no children", () => {
      // Arrange & Act
      const { container } = render(<MenubarShortcut />);

      // Assert
      const shortcutElement = container.querySelector("span");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground",
      );
      expect(shortcutElement).toBeEmptyDOMElement();
    });

    test("should render the MenubarShortcut component with null children", () => {
      // Arrange & Act
      const { container } = render(<MenubarShortcut>{null}</MenubarShortcut>);

      // Assert
      const shortcutElement = container.querySelector("span");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground",
      );
      expect(shortcutElement).toBeEmptyDOMElement();
    });

    test("should render the MenubarShortcut component with undefined children", () => {
      // Arrange & Act
      const { container } = render(
        <MenubarShortcut>{undefined}</MenubarShortcut>,
      );

      // Assert
      const shortcutElement = container.querySelector("span");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground",
      );
      expect(shortcutElement).toBeEmptyDOMElement();
    });

    test("should render the MenubarShortcut component with empty string children", () => {
      // Arrange & Act
      const { container } = render(<MenubarShortcut>{""}</MenubarShortcut>);

      // Assert
      const shortcutElement = container.querySelector("span");
      expect(shortcutElement).toBeInTheDocument();
      expect(shortcutElement).toHaveClass(
        "ml-auto text-xs tracking-widest text-muted-foreground",
      );
      expect(shortcutElement).toBeEmptyDOMElement();
    });
  });
});

// End of unit tests for: MenubarShortcut
