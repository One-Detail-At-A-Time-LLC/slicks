// Unit tests for: ChatComponent

import { useMutation, useQuery } from "convex/react";

import { ChatComponent } from "../Real-TimeChat";

// Mocking dependencies
jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("../../convex/_generated/api", () => ({
  api: {
    messages: {
      list: jest.fn(),
      send: jest.fn(),
    },
  },
}));

describe("ChatComponent() ChatComponent method", () => {
  let mockUseQuery: jest.Mock;
  let mockUseMutation: jest.Mock;

  beforeEach(() => {
    mockUseQuery = useQuery as jest.Mock;
    mockUseMutation = useMutation as jest.Mock;
  });

  describe("Happy Path", () => {
    it("should render messages correctly", () => {
      // Arrange
      const messages = [
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ];
      mockUseQuery.mockReturnValue(messages);
      mockUseMutation.mockReturnValue(jest.fn());

      // Act
      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      // Assert
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    it("should send a message when the send button is clicked", async () => {
      // Arrange
      const sendMessageMock = jest.fn();
      mockUseQuery.mockReturnValue([]);
      mockUseMutation.mockReturnValue(sendMessageMock);

      // Act
      render(<ChatComponent tenantId="tenant1" clientId="client1" />);
      fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
        target: { value: "Test message" },
      });
      fireEvent.click(screen.getByText("Send"));

      // Assert
      expect(sendMessageMock).toHaveBeenCalledWith({
        tenantId: "tenant1",
        clientId: "client1",
        content: "Test message",
        sender: "tenant",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should not send a message if the input is empty", async () => {
      // Arrange
      const sendMessageMock = jest.fn();
      mockUseQuery.mockReturnValue([]);
      mockUseMutation.mockReturnValue(sendMessageMock);

      // Act
      render(<ChatComponent tenantId="tenant1" clientId="client1" />);
      fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
        target: { value: "   " },
      });
      fireEvent.click(screen.getByText("Send"));

      // Assert
      expect(sendMessageMock).not.toHaveBeenCalled();
    });

    it("should handle no messages gracefully", () => {
      // Arrange
      mockUseQuery.mockReturnValue([]);
      mockUseMutation.mockReturnValue(jest.fn());

      // Act
      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      // Assert
      expect(
        screen.getByPlaceholderText("Type your message..."),
      ).toBeInTheDocument();
    });

    it("should scroll to the bottom when new messages arrive", () => {
      // Arrange
      const messages = [
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ];
      mockUseQuery.mockReturnValue(messages);
      mockUseMutation.mockReturnValue(jest.fn());

      // Act
      render(<ChatComponent tenantId="tenant1" clientId="client1" />);
      const messageList = document.getElementById("message-list");

      // Assert
      expect(messageList?.scrollTop).toBe(messageList?.scrollHeight);
    });
  });
});

// End of unit tests for: ChatComponent
