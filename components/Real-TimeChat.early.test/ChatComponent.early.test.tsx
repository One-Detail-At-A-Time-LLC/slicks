// Unit tests for: ChatComponent

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { ChatComponent } from "../Real-TimeChat";

import { useMutation, useQuery } from "convex/react";

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

describe("ChatComponent", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Happy Path", () => {
    it("renders messages correctly", () => {
      const messages = [
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ];

      (useQuery as jest.Mock).mockReturnValue(messages);

      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    it("sends a message when the send button is clicked", async () => {
      const sendMessageMock = jest.fn();

      (useQuery as jest.Mock).mockReturnValue([]);
      (useMutation as jest.Mock).mockReturnValue(sendMessageMock);

      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      fireEvent.change(
        screen.getByPlaceholderText("Type your message..."),
        {
          target: { value: "Test message" },
        }
      );
      fireEvent.click(screen.getByText("Send"));

      await waitFor(() => {
        expect(sendMessageMock).toHaveBeenCalledWith({
          tenantId: "tenant1",
          clientId: "client1",
          content: "Test message",
          sender: "tenant",
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("does not send an empty message", async () => {
      const sendMessageMock = jest.fn();

      (useQuery as jest.Mock).mockReturnValue([]);
      (useMutation as jest.Mock).mockReturnValue(sendMessageMock);

      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      fireEvent.change(
        screen.getByPlaceholderText("Type your message..."),
        {
          target: { value: "   " },
        }
      );
      fireEvent.click(screen.getByText("Send"));

      await waitFor(() => {
        expect(sendMessageMock).not.toHaveBeenCalled();
      });
    });

    it("handles no messages gracefully", () => {
      (useQuery as jest.Mock).mockReturnValue([]);

      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      expect(screen.queryByText("Hello")).not.toBeInTheDocument();
      expect(screen.queryByText("Hi")).not.toBeInTheDocument();
    });

    it("scrolls to the bottom when new messages arrive", () => {
      const messages = [
        { _id: "1", content: "Hello", sender: "tenant", timestamp: Date.now() },
        { _id: "2", content: "Hi", sender: "client", timestamp: Date.now() },
      ];

      (useQuery as jest.Mock).mockReturnValue(messages);

      render(<ChatComponent tenantId="tenant1" clientId="client1" />);

      const messageList = document.getElementById("message-list");

      expect(messageList?.scrollTop).toBe(messageList?.scrollHeight);
    });
  });
});

