// Unit tests for: Home

import Home from "../../app/page.tsx";

import { useOrganization, useUser } from "@clerk/clerk-react";
import { render } from "@testing-library/react";

// __tests__/page.test.tsx
// __tests__/page.test.tsx
jest.mock("@clerk/clerk-react", () => ({
  useUser: jest.fn(),
  useOrganization: jest.fn(),
  SignIn: () => <div>SignIn Component</div>,
  SignUp: () => <div>SignUp Component</div>,
}));

jest.mock("appadmin-dashboard", () => () => (
  <div>AdminDashboard Component</div>
));
jest.mock("appmanager-dashboard", () => () => (
  <div>ManagerDashboard Component</div>
));
jest.mock("appclient-portal", () => () => <div>ClientPortal Component</div>);
jest.mock("componentsPermissionDenied", () => ({
  PermissionDenied: () => <div>PermissionDenied Component: {requiredRole}</div>,
}));

describe("Home() Home method", () => {
  describe("Happy Path", () => {
    it("should render SignIn and SignUp components when user is not signed in", () => {
      (useUser as jest.Mock).mockReturnValue({ isSignedIn: false, user: null });
      (useOrganization as jest.Mock).mockReturnValue({ organization: null });

      const { getByText } = render(<Home />);

      expect(getByText("Welcome to Auto Detailing SaaS")).toBeInTheDocument();
      expect(getByText("SignIn Component")).toBeInTheDocument();
      expect(getByText("SignUp Component")).toBeInTheDocument();
    });

    it("should render loading message when organization data is not available", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({ organization: null });

      const { getByText } = render(<Home />);

      expect(getByText("Loading organization data...")).toBeInTheDocument();
    });

    it("should render AdminDashboard when user role is org:admin", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: "org:admin" } },
      });

      const { getByText } = render(<Home />);

      expect(getByText("AdminDashboard Component")).toBeInTheDocument();
    });

    it("should render ManagerDashboard when user role is org:manager_organization", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: "org:manager_organization" } },
      });

      const { getByText } = render(<Home />);

      expect(getByText("ManagerDashboard Component")).toBeInTheDocument();
    });

    it("should render ClientPortal when user role is org:clients", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: "org:clients" } },
      });

      const { getByText } = render(<Home />);

      expect(getByText("ClientPortal Component")).toBeInTheDocument();
    });

    it("should render member welcome message when user role is org:member", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: {
          name: "Auto Detailing Inc.",
          membership: { role: "org:member" },
        },
      });

      const { getByText } = render(<Home />);

      expect(
        getByText("Welcome, John Doe. You are a member of Auto Detailing Inc."),
      ).toBeInTheDocument();
    });

    it("should render non-member welcome message when user role is org:non_member", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: "org:non_member" } },
      });

      const { getByText } = render(<Home />);

      expect(
        getByText(
          "Welcome, John Doe. You are not yet a member of an organization.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should render PermissionDenied when user role is undefined", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: undefined } },
      });

      const { getByText } = render(<Home />);

      expect(
        getByText("PermissionDenied Component: Any valid role"),
      ).toBeInTheDocument();
    });

    it("should render PermissionDenied when user role is an unexpected value", () => {
      (useUser as jest.Mock).mockReturnValue({
        isSignedIn: true,
        user: { fullName: "John Doe" },
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: { membership: { role: "unexpected_role" } },
      });

      const { getByText } = render(<Home />);

      expect(
        getByText("PermissionDenied Component: Any valid role"),
      ).toBeInTheDocument();
    });
  });
});

// End of unit tests for: Home
