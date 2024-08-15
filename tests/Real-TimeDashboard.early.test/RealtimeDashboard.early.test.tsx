
// Unit tests for: RealtimeDashboard


import { useMutation, useQuery } from 'convex/react';


import { RealtimeDashboard } from '../../components/Real-TimeDashboard.tsx';

import { fireEvent, render, screen } from '@testing-library/react';



// Mock the convex/react hooks
jest.mock("convex/react", () => ({
    useQuery: jest.fn(),
    useMutation: jest.fn(),
}));

describe('RealtimeDashboard() RealtimeDashboard method', () => {
    // Happy path tests
    describe('Happy Path', () => {
        beforeEach(() => {
            // Mock data for ongoing services
            const mockOngoingServices = [
                {
                    _id: '1',
                    serviceName: 'Service 1',
                    clientId: 'Client1',
                    vehicleId: 'Vehicle1',
                    assignedStaff: 'Staff1',
                    status: 'ongoing',
                    startTime: new Date().toISOString(),
                    estimatedEndTime: new Date(Date.now() + 3600000).toISOString(),
                },
            ];

            (useQuery as jest.Mock).mockReturnValue(mockOngoingServices);
            (useMutation as jest.Mock).mockReturnValue(jest.fn());
        });

        it('should render ongoing services correctly', () => {
            render(<RealtimeDashboard />);
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.getByText('Service 1')).toBeInTheDocument();
            expect(screen.getByText('Client ID: Client1')).toBeInTheDocument();
            expect(screen.getByText('Vehicle ID: Vehicle1')).toBeInTheDocument();
            expect(screen.getByText('Assigned Staff: Staff1')).toBeInTheDocument();
            expect(screen.getByText('Status: ongoing')).toBeInTheDocument();
        });

        it('should call updateServiceStatus when "Mark as Completed" button is clicked', async () => {
            const mockUpdateServiceStatus = jest.fn();
            (useMutation as jest.Mock).mockReturnValue(mockUpdateServiceStatus);

            render(<RealtimeDashboard />);
            const button = screen.getByText('Mark as Completed');
            fireEvent.click(button);

            expect(mockUpdateServiceStatus).toHaveBeenCalledWith({ serviceId: '1', status: 'completed' });
        });
    });

    // Edge case tests
    describe('Edge Cases', () => {
        it('should handle no ongoing services gracefully', () => {
            (useQuery as jest.Mock).mockReturnValue([]);
            render(<RealtimeDashboard />);
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
        });

        it('should handle null ongoing services gracefully', () => {
            (useQuery as jest.Mock).mockReturnValue(null);
            render(<RealtimeDashboard />);
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
        });

        it('should handle invalid date formats gracefully', () => {
            const mockOngoingServices = [
                {
                    _id: '1',
                    serviceName: 'Service 1',
                    clientId: 'Client1',
                    vehicleId: 'Vehicle1',
                    assignedStaff: 'Staff1',
                    status: 'ongoing',
                    startTime: 'invalid-date',
                    estimatedEndTime: 'invalid-date',
                },
            ];

            (useQuery as jest.Mock).mockReturnValue(mockOngoingServices);
            render(<RealtimeDashboard />);
            expect(screen.getByText('Ongoing Services')).toBeInTheDocument();
            expect(screen.getByText('Service 1')).toBeInTheDocument();
            expect(screen.getByText('Client ID: Client1')).toBeInTheDocument();
            expect(screen.getByText('Vehicle ID: Vehicle1')).toBeInTheDocument();
            expect(screen.getByText('Assigned Staff: Staff1')).toBeInTheDocument();
            expect(screen.getByText('Status: ongoing')).toBeInTheDocument();
            expect(screen.getByText('Invalid Date')).toBeInTheDocument();
        });
    });
});

// End of unit tests for: RealtimeDashboard
