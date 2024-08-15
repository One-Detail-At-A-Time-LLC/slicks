// Unit tests for: AppointmentScheduling

import { useForm } from "react-hook-form";

import { useMutation } from "convex/react";

import { AppointmentScheduling } from "../AppointmentScheduling";

// Mock necessary modules
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(),
  Controller: jest.fn(),
}));
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(),
}));
jest.mock("convex/react", () => ({
  useMutation: jest.fn(),
}));
jest.mock("../../convex/_generated/api", () => ({
  api: {
    appointment: {
      schedule: jest.fn(),
    },
  },
}));
jest.mock("../ui/button", () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  )),
}));
jest.mock("../ui/date-picker", () => ({
  DatePicker: jest.fn(() => <input type="date" {...props} />),
}));
jest.mock("../ui/time-picker", () => ({
  TimePicker: jest.fn(() => <input type="time" {...props} />),
}));

describe("AppointmentScheduling() AppointmentScheduling method", () => {
  const tenantId = "tenant123";
  const estimateId = "estimate123";
  const mockScheduleAppointment = jest.fn();

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        fn();
      },
      formState: { errors: {} },
    });
    (useMutation as jest.Mock).mockReturnValue(mockScheduleAppointment);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Path", () => {
    it("should render the form correctly", () => {
      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );
      expect(screen.getByPlaceholderText("Select Date")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Select Time")).toBeInTheDocument();
      expect(screen.getByText("Schedule Appointment")).toBeInTheDocument();
    });

    it("should schedule an appointment successfully", async () => {
      mockScheduleAppointment.mockResolvedValueOnce({
        startTime: "2023-10-10T10:00:00Z",
      });

      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );

      fireEvent.change(screen.getByPlaceholderText("Select Date"), {
        target: { value: "2023-10-10" },
      });
      fireEvent.change(screen.getByPlaceholderText("Select Time"), {
        target: { value: "10:00" },
      });
      fireEvent.click(screen.getByText("Schedule Appointment"));

      await waitFor(() => {
        expect(mockScheduleAppointment).toHaveBeenCalledWith({
          tenantId,
          estimateId,
          startTime: new Date("2023-10-10T10:00:00").getTime(),
        });
        expect(
          screen.getByText(
            "Appointment scheduled successfully for 2023-10-10T10:00:00Z",
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should show an error message if date is not selected", async () => {
      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );

      fireEvent.change(screen.getByPlaceholderText("Select Time"), {
        target: { value: "10:00" },
      });
      fireEvent.click(screen.getByText("Schedule Appointment"));

      await waitFor(() => {
        expect(mockScheduleAppointment).not.toHaveBeenCalled();
        expect(
          screen.queryByText("Appointment scheduled successfully"),
        ).not.toBeInTheDocument();
      });
    });

    it("should show an error message if time is not selected", async () => {
      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );

      fireEvent.change(screen.getByPlaceholderText("Select Date"), {
        target: { value: "2023-10-10" },
      });
      fireEvent.click(screen.getByText("Schedule Appointment"));

      await waitFor(() => {
        expect(mockScheduleAppointment).not.toHaveBeenCalled();
        expect(
          screen.queryByText("Appointment scheduled successfully"),
        ).not.toBeInTheDocument();
      });
    });

    it("should handle invalid time format gracefully", async () => {
      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );

      fireEvent.change(screen.getByPlaceholderText("Select Date"), {
        target: { value: "2023-10-10" },
      });
      fireEvent.change(screen.getByPlaceholderText("Select Time"), {
        target: { value: "25:00" },
      });
      fireEvent.click(screen.getByText("Schedule Appointment"));

      await waitFor(() => {
        expect(mockScheduleAppointment).not.toHaveBeenCalled();
        expect(
          screen.queryByText("Appointment scheduled successfully"),
        ).not.toBeInTheDocument();
      });
    });

    it("should handle scheduling failure gracefully", async () => {
      mockScheduleAppointment.mockRejectedValueOnce(new Error("Network error"));

      render(
        <AppointmentScheduling tenantId={tenantId} estimateId={estimateId} />,
      );

      fireEvent.change(screen.getByPlaceholderText("Select Date"), {
        target: { value: "2023-10-10" },
      });
      fireEvent.change(screen.getByPlaceholderText("Select Time"), {
        target: { value: "10:00" },
      });
      fireEvent.click(screen.getByText("Schedule Appointment"));

      await waitFor(() => {
        expect(mockScheduleAppointment).toHaveBeenCalled();
        expect(
          screen.getByText("Failed to schedule appointment. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });
});

// End of unit tests for: AppointmentScheduling
