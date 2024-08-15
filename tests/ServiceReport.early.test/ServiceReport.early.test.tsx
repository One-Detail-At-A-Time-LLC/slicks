
// Unit tests for: ServiceReport


import { useMutation, useQuery } from 'convex/react';

import { api } from 'convex\_generated\api';

import { Id } from 'convex\_generated\dataModel';

import { ServiceReport } from '../../components/ServiceReport.tsx';

import { fireEvent, render, waitFor } from '@testing-library/react';



// Mocking the necessary dependencies
jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

// Mocking the api
jest.mock("convex\_generated\api", () => ({
    api: {
        serviceReports: {
            generateServiceReport: jest.fn(),
            getServiceReport: jest.fn(),
        },
    },
}));

// Mocking the Id type
class MockId {
    public id: string = 'mock-id';
}

interface MockServiceReportProps {
    clientId: Id<"clients">;
    vehicleId: Id<"vehicles">;
    assessmentId: Id<"vehicleAssessments">;
}

describe('ServiceReport() ServiceReport method', () => {
    let mockProps: MockServiceReportProps;

    beforeEach(() => {
        mockProps = {
            clientId: new MockId<"clients">() as any,
            vehicleId: new MockId<"vehicles">() as any,
            assessmentId: new MockId<"vehicleAssessments">() as any,
        };

        (useMutation as jest.Mock).mockReturnValue(jest.fn().mockResolvedValue(new MockId<"serviceReports">() as any));
        (useQuery as jest.Mock).mockReturnValue(null);
    });

    describe('Happy Path', () => {
        it('should render the component correctly', () => {
            const { getByPlaceholderText, getByText } = render(<ServiceReport {...mockProps as any} />);
            expect(getByPlaceholderText('Add service')).toBeInTheDocument();
            expect(getByPlaceholderText('Total cost')).toBeInTheDocument();
            expect(getByText('Generate Report')).toBeInTheDocument();
        });

        it('should add a service to the list when Enter is pressed', () => {
            const { getByPlaceholderText, getByText } = render(<ServiceReport {...mockProps as any} />);
            const input = getByPlaceholderText('Add service');
            fireEvent.change(input, { target: { value: 'Oil Change' } });
            fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
            expect(getByText('Oil Change')).toBeInTheDocument();
        });

        it('should update the total cost when input changes', () => {
            const { getByPlaceholderText } = render(<ServiceReport {...mockProps as any} />);
            const input = getByPlaceholderText('Total cost');
            fireEvent.change(input, { target: { value: '100' } });
            expect((input as HTMLInputElement).value).toBe('100');
        });

        it('should generate a report when the button is clicked', async () => {
            const { getByText } = render(<ServiceReport {...mockProps as any} />);
            const button = getByText('Generate Report');
            fireEvent.click(button);
            await waitFor(() => {
                expect(useMutation).toHaveBeenCalledWith(api.serviceReports.generateServiceReport);
            });
        });

        it('should display the generated report when available', async () => {
            (useQuery as jest.Mock).mockReturnValue({
                date: new Date().toISOString(),
                totalCost: 100,
                reportUrl: 'http://example.com/report.pdf',
            } as any);

            const { getByText } = render(<ServiceReport {...mockProps as any} />);
            const button = getByText('Generate Report');
            fireEvent.click(button);

            await waitFor(() => {
                expect(getByText('Generated Report')).toBeInTheDocument();
                expect(getByText(/Date:/)).toBeInTheDocument();
                expect(getByText(/Total Cost:/)).toBeInTheDocument();
                expect(getByText('View Full Report (PDF)')).toBeInTheDocument();
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty service input gracefully', () => {
            const { getByPlaceholderText, queryByText } = render(<ServiceReport {...mockProps as any} />);
            const input = getByPlaceholderText('Add service');
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
            expect(queryByText('')).not.toBeInTheDocument();
        });

        it('should handle invalid total cost input gracefully', () => {
            const { getByPlaceholderText } = render(<ServiceReport {...mockProps as any} />);
            const input = getByPlaceholderText('Total cost');
            fireEvent.change(input, { target: { value: 'invalid' } });
            expect((input as HTMLInputElement).value).toBe('invalid');
        });

        it('should handle generate report failure gracefully', async () => {
            (useMutation as jest.Mock).mockReturnValue(jest.fn().mockRejectedValue(new Error('Failed to generate report')));

            const { getByText } = render(<ServiceReport {...mockProps as any} />);
            const button = getByText('Generate Report');
            fireEvent.click(button);

            await waitFor(() => {
                expect(useMutation).toHaveBeenCalledWith(api.serviceReports.generateServiceReport);
            });
        });

        it('should handle no report data gracefully', () => {
            (useQuery as jest.Mock).mockReturnValue(null);

            const { queryByText } = render(<ServiceReport {...mockProps as any} />);
            expect(queryByText('Generated Report')).not.toBeInTheDocument();
        });
    });
});

// End of unit tests for: ServiceReport
