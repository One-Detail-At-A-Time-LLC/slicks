// Unit tests for: useTenant

import { useUser } from "@clerk/nextjs";

import { useMutation, useQuery } from "convex/react";

import { useTenant } from "../../hooks/tenantManagement";

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

describe("useTenant() useTenant method", () => {
  let mockUser: any;
  let mockGetTenant: jest.Mock;
  let mockCreateTenant: jest.Mock;

  beforeEach(() => {
    mockUser = { id: "user123", firstName: "John" };
    mockGetTenant = jest.fn();
    mockCreateTenant = jest.fn();

    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useQuery as jest.Mock).mockReturnValue(mockGetTenant);
    (useMutation as jest.Mock).mockReturnValue(mockCreateTenant);
  });

  describe("Happy Path", () => {
    it("should fetch and set an existing tenant if user exists", async () => {
      // Arrange
      const existingTenant = {
        _id: { tableName: "tenants", id: "tenant123" },
        name: "John's Auto Detailing",
        ownerId: "user123",
        pricingStructure: [],
        costOfGoods: [],
        laborCost: 0,
        qrCode: "",
      };
      mockGetTenant.mockResolvedValue(existingTenant);

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useTenant());
      await waitForNextUpdate();

      // Assert
      expect(result.current).toEqual(existingTenant);
      expect(mockGetTenant).toHaveBeenCalledWith("user123");
    });

    it("should create and set a new tenant if no existing tenant is found", async () => {
      // Arrange
      const newTenant = {
        _id: { tableName: "tenants", id: "tenant123" },
        name: "John's Auto Detailing",
        ownerId: "user123",
        pricingStructure: [],
        costOfGoods: [],
        laborCost: 0,
        qrCode: "",
      };
      mockGetTenant.mockResolvedValue(null);
      mockCreateTenant.mockResolvedValue(newTenant);

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useTenant());
      await waitForNextUpdate();

      // Assert
      expect(result.current).toEqual(newTenant);
      expect(mockGetTenant).toHaveBeenCalledWith("user123");
      expect(mockCreateTenant).toHaveBeenCalledWith({
        name: "John's Auto Detailing",
        ownerId: "user123",
        pricingStructure: [],
        costOfGoods: [],
        laborCost: 0,
        qrCode: "",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return null if no user is logged in", () => {
      // Arrange
      (useUser as jest.Mock).mockReturnValue({ user: null });

      // Act
      const { result } = renderHook(() => useTenant());

      // Assert
      expect(result.current).toBeNull();
      expect(mockGetTenant).not.toHaveBeenCalled();
      expect(mockCreateTenant).not.toHaveBeenCalled();
    });

    it("should handle errors when fetching an existing tenant", async () => {
      // Arrange
      mockGetTenant.mockRejectedValue(new Error("Failed to fetch tenant"));

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useTenant());
      await waitForNextUpdate();

      // Assert
      expect(result.current).toBeNull();
      expect(mockGetTenant).toHaveBeenCalledWith("user123");
    });

    it("should handle errors when creating a new tenant", async () => {
      // Arrange
      mockGetTenant.mockResolvedValue(null);
      mockCreateTenant.mockRejectedValue(new Error("Failed to create tenant"));

      // Act
      const { result, waitForNextUpdate } = renderHook(() => useTenant());
      await waitForNextUpdate();

      // Assert
      expect(result.current).toBeNull();
      expect(mockGetTenant).toHaveBeenCalledWith("user123");
      expect(mockCreateTenant).toHaveBeenCalledWith({
        name: "John's Auto Detailing",
        ownerId: "user123",
        pricingStructure: [],
        costOfGoods: [],
        laborCost: 0,
        qrCode: "",
      });
    });
  });
});

// End of unit tests for: useTenant
