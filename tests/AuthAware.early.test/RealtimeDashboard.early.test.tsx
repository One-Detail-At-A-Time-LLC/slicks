
// Unit tests for: RealtimeDashboard

import { JSDOM } from 'jsdom';
import { useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { RealtimeDashboard } from '../../components/AuthAware.tsx';
import { fireEvent, render, screen } from '@testing-library/react';

test('renders the dashboard with ongoing services', () => {
    // Arrange
    const mockUser = { user: { organizationName: 'TestOrg' } };
    const mockServices = [
        {
            _id: '1',
            serviceName: 'Service 1',
            clientId: 'Client1',
            vehicleId: 'Vehicle1',
            assignedStaff: 'Staff1',
            status: 'ongoing',
            startTime: new Date().toISOString(),
            estimatedEndTime: new Date().toISOString(),
        },
    ];

    mockUseUser.mockReturnValue(mockUser);
    mockUseQuery.mockReturnValue(mockServices);
    mockUseMutation.mockReturnValue(jest.fn());

    // Act
    const { container } = render(<RealtimeDashboard />);
    const document = container.ownerDocument;

    // Assert
    expect(screen.getByText('Ongoing Services for TestOrg')).toBeInTheDocument();
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Client ID: Client1')).toBeInTheDocument();
    expect(screen.getByText('Vehicle ID: Vehicle1')).toBeInTheDocument();
    expect(screen.getByText('Assigned Staff: Staff1')).toBeInTheDocument();
    expect(screen.getByText('Status: ongoing')).toBeInTheDocument();
});


const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.document = dom.window.document;
global.window = dom.window;

// Mocking the necessary hooks and functions
jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock("@clerk/clerk-react", () => ({
    useUser: jest.fn(),
}));

describe('RealtimeDashboard() RealtimeDashboard method', () => {
    let mockUseMutation: jest.Mock;
    let mockUseQuery: jest.Mock;
    let mockUseUser: jest.Mock;

    beforeEach(() => {
        mockUseMutation = useMutation as jest.Mock;
        mockUseQuery = useQuery as jest.Mock;
        mockUseUser = useUser as jest.Mock;
    });

    describe('Happy Path', () => {
        test('renders the dashboard with ongoing services', () => {
            // Arrange
            const mockUser = { user: { organizationName: 'TestOrg' } };
            const mockServices = [
                {
                    _id: '1',
                    serviceName: 'Service 1',
                    clientId: 'Client1',
                    vehicleId: 'Vehicle1',
                    assignedStaff: 'Staff1',
                    status: 'ongoing',
                    startTime: new Date().toISOString(),
                    estimatedEndTime: new Date().toISOString(),
                },
            ];

            mockUseUser.mockReturnValue(mockUser);
            mockUseQuery.mockReturnValue(mockServices);
            mockUseMutation.mockReturnValue(jest.fn());

            // Act
            render(<RealtimeDashboard />);

            // Assert
            expect(screen.getByText('Ongoing Services for TestOrg')).toBeInTheDocument();
            expect(screen.getByText('Service 1')).toBeInTheDocument();
            expect(screen.getByText('Client ID: Client1')).toBeInTheDocument();
            expect(screen.getByText('Vehicle ID: Vehicle1')).toBeInTheDocument();
            expect(screen.getByText('Assigned Staff: Staff1')).toBeInTheDocument();
            expect(screen.getByText('Status: ongoing')).toBeInTheDocument();
        });

        test('updates service status when button is clicked', async () => {
            // Arrange
            const mockUser = { user: { organizationName: 'TestOrg' } };
            const mockServices = [
                {
                    _id: '1',
                    serviceName: 'Service 1',
                    clientId: 'Client1',
                    vehicleId: 'Vehicle1',
                    assignedStaff: 'Staff1',
                    status: 'ongoing',
                    startTime: new Date().toISOString(),
                    estimatedEndTime: new Date().toISOString(),
                },
            ];
            const mockUpdateServiceStatus = jest.fn();

            mockUseUser.mockReturnValue(mockUser);
            mockUseQuery.mockReturnValue(mockServices);
            mockUseMutation.mockReturnValue(mockUpdateServiceStatus);

            // Act
            render(<RealtimeDashboard />);
            fireEvent.click(screen.getByText('Mark as Completed'));

            // Assert
            expect(mockUpdateServiceStatus).toHaveBeenCalledWith({ serviceId: '1', status: 'completed' });
        });
    });

    describe('Edge Cases', () => {
        test('renders sign-in message when user is not authenticated', () => {
            // Arrange
            mockUseUser.mockReturnValue({ user: null });
            mockUseQuery.mockReturnValue([]);
            mockUseMutation.mockReturnValue(jest.fn());

            // Act
            render(<RealtimeDashboard />);

            // Assert
            expect(screen.getByText('Please sign in to access the dashboard.')).toBeInTheDocument();
        });

        test('renders empty state when there are no ongoing services', () => {
            // Arrange
            const mockUser = { user: { organizationName: 'TestOrg' } };

            mockUseUser.mockReturnValue(mockUser);
            mockUseQuery.mockReturnValue([]);
            mockUseMutation.mockReturnValue(jest.fn());

            // Act
            render(<RealtimeDashboard />);

            // Assert
            expect(screen.getByText('Ongoing Services for TestOrg')).toBeInTheDocument();
            expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
        });

        test('handles error in updating service status gracefully', async () => {
            // Arrange
            const mockUser = { user: { organizationName: 'TestOrg' } };
            const mockServices = [
                {
                    _id: '1',
                    serviceName: 'Service 1',
                    clientId: 'Client1',
                    vehicleId: 'Vehicle1',
                    assignedStaff: 'Staff1',
                    status: 'ongoing',
                    startTime: new Date().toISOString(),
                    estimatedEndTime: new Date().toISOString(),
                },
            ];
            const mockUpdateServiceStatus = jest.fn().mockRejectedValue(new Error('Update failed'));

            mockUseUser.mockReturnValue(mockUser);
            mockUseQuery.mockReturnValue(mockServices);
            mockUseMutation.mockReturnValue(mockUpdateServiceStatus);

            // Act
            render(<RealtimeDashboard />);
            fireEvent.click(screen.getByText('Mark as Completed'));

            // Assert
            expect(mockUpdateServiceStatus).toHaveBeenCalledWith({ serviceId: '1', status: 'completed' });
            // Here you can add more assertions to check if the error is handled gracefully in the UI
        });
    });
});

// End of unit tests for: RealtimeDashboard
