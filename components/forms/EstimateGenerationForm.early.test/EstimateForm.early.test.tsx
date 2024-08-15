// Unit tests for: EstimateForm

import { useMutation } from "convex/react";

import { EstimateForm } from "../EstimateGenerationForm";

jest.mock("convex/react", () => ({
  useMutation: jest.fn(),
}));

jest.mock("../../convex/_generated/api", () => ({
  api: {
    estimate: {
      generate: jest.fn(),
    },
  },
}));

describe("EstimateForm() EstimateForm method", () => {
  const mockGenerateEstimate = jest.fn();

  beforeEach(() => {
    (useMutation as jest.Mock).mockReturnValue(mockGenerateEstimate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    test("should render the form and submit with valid data", async () => {
      mockGenerateEstimate.mockResolvedValue({ totalPrice: 100 });

      render(<EstimateForm tenantId="test-tenant" />);

      fireEvent.change(screen.getByPlaceholderText("Client Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Make"), {
        target: { value: "Toyota" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Model"), {
        target: { value: "Camry" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Year"), {
        target: { value: "2020" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Size"), {
        target: { value: "medium" },
      });
      fireEvent.click(screen.getByLabelText("Exterior Wash"));

      fireEvent.click(screen.getByText("Generate Estimate"));

      await waitFor(() => {
        expect(mockGenerateEstimate).toHaveBeenCalledWith({
          tenantId: "test-tenant",
          clientName: "John Doe",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleYear: 2020,
          vehicleSize: "medium",
          services: ["exteriorWash"],
        });
        expect(
          screen.getByText("Estimated Price: $100.00"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    test("should show validation errors for empty required fields", async () => {
      render(<EstimateForm tenantId="test-tenant" />);

      fireEvent.click(screen.getByText("Generate Estimate"));

      await waitFor(() => {
        expect(screen.getByText("Client name is required")).toBeInTheDocument();
        expect(
          screen.getByText("Vehicle make is required"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Vehicle model is required"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("At least one service must be selected"),
        ).toBeInTheDocument();
      });
    });

    test("should show validation error for invalid vehicle year", async () => {
      render(<EstimateForm tenantId="test-tenant" />);

      fireEvent.change(screen.getByPlaceholderText("Vehicle Year"), {
        target: { value: "1800" },
      });
      fireEvent.click(screen.getByText("Generate Estimate"));

      await waitFor(() => {
        expect(
          screen.getByText("Number must be greater than or equal to 1900"),
        ).toBeInTheDocument();
      });
    });

    test("should handle API error gracefully", async () => {
      mockGenerateEstimate.mockRejectedValue(new Error("API Error"));

      render(<EstimateForm tenantId="test-tenant" />);

      fireEvent.change(screen.getByPlaceholderText("Client Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Make"), {
        target: { value: "Toyota" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Model"), {
        target: { value: "Camry" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Year"), {
        target: { value: "2020" },
      });
      fireEvent.change(screen.getByPlaceholderText("Vehicle Size"), {
        target: { value: "medium" },
      });
      fireEvent.click(screen.getByLabelText("Exterior Wash"));

      fireEvent.click(screen.getByText("Generate Estimate"));

      await waitFor(() => {
        expect(mockGenerateEstimate).toHaveBeenCalledWith({
          tenantId: "test-tenant",
          clientName: "John Doe",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleYear: 2020,
          vehicleSize: "medium",
          services: ["exteriorWash"],
        });
        expect(
          screen.queryByText("Estimated Price: $100.00"),
        ).not.toBeInTheDocument();
      });
    });
  });
});

// End of unit tests for: EstimateForm
