
// Unit tests for: ManagerDashboard
import { useMutation, useQuery } from 'convex/react';


import ManagerDashboard from '../../../../../app/[tenantId]/(dashboard)/@management/page.tsx';

import { useOrganization, useUser } from "@clerk/clerk-react";
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock("@clerk/clerk-react", () => ({
    useUser: jest.fn(),
    useOrganization: jest.fn(),
}));

jest.mock("convex/react", () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
}));

describe('ManagerDashboard() ManagerDashboard method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Path', () => {
        it('should render the Manager Dashboard with ongoing services', () => {
            // Mocking user and organization with manager role
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:manager_organization' } } });
            (useQuery as jest.Mock).mockReturnValue([
                { _id: 'service1', serviceName: 'Service 1', status: 'ongoing' },
                { _id: 'service2', serviceName: 'Service 2', status: 'ongoing' },
            ]);
            const mockUpdateServiceStatus = jest.fn();
            (useMutation as jest.Mock).mockReturnValue(mockUpdateServiceStatus);

            render(<ManagerDashboard />);

            expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.getByText('Service 1')).toBeInTheDocument();
            expect(screen.getByText('Service 2')).toBeInTheDocument();
        });

        it('should call updateServiceStatus when "Mark as Completed" button is clicked', () => {
            // Mocking user and organization with manager role
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:manager_organization' } } });
            (useQuery as jest.Mock).mockReturnValue([
                { _id: 'service1', serviceName: 'Service 1', status: 'ongoing' },
            ]);
            const mockUpdateServiceStatus = jest.fn();
            (useMutation as jest.Mock).mockReturnValue(mockUpdateServiceStatus);

            render(<ManagerDashboard />);

            fireEvent.click(screen.getByText('Mark as Completed'));

            expect(mockUpdateServiceStatus).toHaveBeenCalledWith({ serviceId: 'service1', status: 'completed' });
        });
    });

    describe('Edge Cases', () => {
        it('should display "Access denied" if user is not logged in', () => {
            // Mocking no user
            (useUser as jest.Mock).mockReturnValue({ user: null });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:manager_organization' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ManagerDashboard />);

            expect(screen.getByText('Access denied. Manager privileges required.')).toBeInTheDocument();
        });

        it('should display "Access denied" if user is not a manager', () => {
            // Mocking user with non-manager role
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:member' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ManagerDashboard />);

            expect(screen.getByText('Access denied. Manager privileges required.')).toBeInTheDocument();
        });

        it('should handle no ongoing services gracefully', () => {
            // Mocking user and organization with manager role
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:manager_organization' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ManagerDashboard />);

            expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
        });
    });
});

// End of unit tests for: ManagerDashboard
