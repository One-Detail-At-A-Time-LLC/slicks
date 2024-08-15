
// Unit tests for: ClientPortal
import { useMutation, useQuery } from 'convex/react';


import ClientPortal from '../../../../../app/[tenantId]/(dashboard)/@client/page.tsx';

import { useOrganization, useUser } from "@clerk/clerk-react";
import { render, screen } from '@testing-library/react';

jest.mock("@clerk/clerk-react", () => ({
    useUser: jest.fn(),
    useOrganization: jest.fn(),
}));

jest.mock("convex/react", () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
}));

describe('ClientPortal() ClientPortal method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Path', () => {
        it('should render client portal with appointments when user and organization are valid', () => {
            // Mocking the hooks
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:clients' } } });
            (useQuery as jest.Mock).mockReturnValue([
                { _id: '1', serviceName: 'Service 1', date: '2023-10-01T10:00:00Z' },
                { _id: '2', serviceName: 'Service 2', date: '2023-10-02T11:00:00Z' },
            ]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ClientPortal />);

            expect(screen.getByText('Client Portal')).toBeInTheDocument();
            expect(screen.getByText('Your Appointments')).toBeInTheDocument();
            expect(screen.getByText('Service 1 - 10/1/2023, 10:00:00 AM')).toBeInTheDocument();
            expect(screen.getByText('Service 2 - 10/2/2023, 11:00:00 AM')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should render access denied message when user is not present', () => {
            // Mocking the hooks
            (useUser as jest.Mock).mockReturnValue({ user: null });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:clients' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ClientPortal />);

            expect(screen.getByText('Access denied. Client access required.')).toBeInTheDocument();
        });

        it('should render access denied message when organization is not present', () => {
            // Mocking the hooks
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: null });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ClientPortal />);

            expect(screen.getByText('Access denied. Client access required.')).toBeInTheDocument();
        });

        it('should render access denied message when user role is not org:clients', () => {
            // Mocking the hooks
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:admin' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ClientPortal />);

            expect(screen.getByText('Access denied. Client access required.')).toBeInTheDocument();
        });

        it('should render client portal with no appointments when there are no appointments', () => {
            // Mocking the hooks
            (useUser as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
            (useOrganization as jest.Mock).mockReturnValue({ organization: { membership: { role: 'org:clients' } } });
            (useQuery as jest.Mock).mockReturnValue([]);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());

            render(<ClientPortal />);

            expect(screen.getByText('Client Portal')).toBeInTheDocument();
            expect(screen.getByText('Your Appointments')).toBeInTheDocument();
            expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        });
    });
});

// End of unit tests for: ClientPortal
