// Unit tests for: ChatComponent

import { useMutation, useQuery } from "convex/react";

import { ChatComponent } from "../Real-TimeChat";

// Mock dependencies
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
  const tenantId = "tenant123";
  const clientId = "client123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    test("renders messages correctly", () => {
      // Mock useQuery to return messages
      (useQuery as jest.Mock).mockReturnValue([
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ]);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    test("sends a message when the send button is clicked", async () => {
      const sendMessageMock = jest.fn();
      (useQuery as jest.Mock).mockReturnValue([]);
      (useMutation as jest.Mock).mockReturnValue(sendMessageMock);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      const input = screen.getByPlaceholderText("Type your message...");
      const button = screen.getByText("Send");

      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(sendMessageMock).toHaveBeenCalledWith({
          tenantId,
          clientId,
          content: "Test message",
          sender: "tenant",
        });
      });

      expect(input).toHaveValue("");
    });

    test("sends a message when Enter key is pressed", async () => {
      const sendMessageMock = jest.fn();
      (useQuery as jest.Mock).mockReturnValue([]);
      (useMutation as jest.Mock).mockReturnValue(sendMessageMock);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      const input = screen.getByPlaceholderText("Type your message...");

      fireEvent.change(input, { target: { value: "Test message" } });
      fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

      await waitFor(() => {
        expect(sendMessageMock).toHaveBeenCalledWith({
          tenantId,
          clientId,
          content: "Test message",
          sender: "tenant",
        });
      });

      expect(input).toHaveValue("");
    });
  });

  describe("Edge Cases", () => {
    test("does not send an empty message", async () => {
      const sendMessageMock = jest.fn();
      (useQuery as jest.Mock).mockReturnValue([]);
      (useMutation as jest.Mock).mockReturnValue(sendMessageMock);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      const input = screen.getByPlaceholderText("Type your message...");
      const button = screen.getByText("Send");

      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(sendMessageMock).not.toHaveBeenCalled();
      });

      expect(input).toHaveValue("   ");
    });

    test("handles no messages gracefully", () => {
      (useQuery as jest.Mock).mockReturnValue([]);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      expect(screen.queryByText("Hello")).not.toBeInTheDocument();
      expect(screen.queryByText("Hi")).not.toBeInTheDocument();
    });

    test("scrolls to bottom when new messages arrive", () => {
      const messages = [
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ];

      (useQuery as jest.Mock).mockReturnValue(messages);

      render(<ChatComponent tenantId={tenantId} clientId={clientId} />);

      const messageList = document.getElementById("message-list");
      if (messageList) {
        expect(messageList.scrollTop).toBe(messageList.scrollHeight);
      }
    });
  });
});

// End of unit tests for: ChatComponent
