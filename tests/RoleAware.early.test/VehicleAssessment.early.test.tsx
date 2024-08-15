
// Unit tests for: VehicleAssessment


import { useMutation, useQuery } from 'convex/react';

import { api } from 'convex\_generated\api';


import { useOrganization, useUser } from '@clerk/nextjs';

import { VehicleAssessment } from '../../components/RoleAware.tsx';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';



// Mocking necessary dependencies
jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock("@clerk/clerk-react", () => ({
    useUser: jest.fn(),
    useOrganization: jest.fn(),
}));

// MockId type to simulate the behavior of the missing dependencies
type MockId<T> = {
    id: string;
    type: T;
};

// Mock implementations
const mockUseUser = useUser as jest.Mock;
const mockUseOrganization = useOrganization as jest.Mock;
const mockUseMutation = useMutation as jest.Mock;
const mockUseQuery = useQuery as jest.Mock;

describe('VehicleAssessment() VehicleAssessment method', () => {
    let mockClientId: MockId<'clients'>;
    let mockVehicleId: MockId<'vehicles'>;
    let mockGenerateUploadUrl: jest.Mock;
    let mockProcessVehicleImage: jest.Mock;
    let mockGetAssessment: jest.Mock;
    let mockFindSimilarVehicles: jest.Mock;

    beforeEach(() => {
        mockClientId = { id: 'client1', type: 'clients' } as any;
        mockVehicleId = { id: 'vehicle1', type: 'vehicles' } as any;

        mockGenerateUploadUrl = jest.fn().mockResolvedValue('http://upload.url') as any;
        mockProcessVehicleImage = jest.fn().mockResolvedValue({ id: 'assessment1', type: 'vehicleAssessments' }) as any;
        mockGetAssessment = jest.fn().mockReturnValue({
            imageUrl: 'http://image.url',
            description: 'Test Description',
            condition: 'Good',
            recommendedServices: ['Service1', 'Service2'],
        }) as any;
        mockFindSimilarVehicles = jest.fn().mockReturnValue([
            {
                imageUrl: 'http://similar1.url',
                condition: 'Fair',
                similarity: 0.85,
            },
            {
                imageUrl: 'http://similar2.url',
                condition: 'Good',
                similarity: 0.90,
            },
        ]) as any;

        mockUseUser.mockReturnValue({ user: { fullName: 'Test User' } });
        mockUseOrganization.mockReturnValue({ organization: { membership: { role: 'org:member' } } });
        mockUseMutation.mockImplementation((apiCall) => {
            if (apiCall === api.vehicleAssessments.generateUploadUrl) return mockGenerateUploadUrl;
            if (apiCall === api.vehicleAssessments.processVehicleImage) return mockProcessVehicleImage;
        });
        mockUseQuery.mockImplementation((apiCall) => {
            if (apiCall === api.vehicleAssessments.getAssessment) return mockGetAssessment;
            if (apiCall === api.vehicleAssessments.findSimilarVehicles) return mockFindSimilarVehicles;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Happy Path', () => {
        it('should render the component and handle file upload successfully', async () => {
            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            // Check if the component renders correctly
            expect(screen.getByText('Vehicle Assessment for Test User')).toBeInTheDocument();

            // Simulate file upload
            const fileInput = screen.getByLabelText('Upload File') as HTMLInputElement;
            const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                expect(mockGenerateUploadUrl).toHaveBeenCalled();
                expect(mockProcessVehicleImage).toHaveBeenCalledWith({
                    clientId: mockClientId,
                    vehicleId: mockVehicleId,
                    storageId: 'storageId',
                });
            });

            // Check if the assessment result is displayed
            expect(screen.getByText('Assessment Result')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
            expect(screen.getByText('Good')).toBeInTheDocument();
            expect(screen.getByText('Service1')).toBeInTheDocument();
            expect(screen.getByText('Service2')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle no user or organization', () => {
            mockUseUser.mockReturnValue({ user: null });
            mockUseOrganization.mockReturnValue({ organization: null });

            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            expect(screen.getByText('Please sign in to access this feature.')).toBeInTheDocument();
        });

        it('should handle file upload with no file selected', async () => {
            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            const fileInput = screen.getByLabelText('Upload File') as HTMLInputElement;

            fireEvent.change(fileInput, { target: { files: [] } });

            await waitFor(() => {
                expect(mockGenerateUploadUrl).not.toHaveBeenCalled();
                expect(mockProcessVehicleImage).not.toHaveBeenCalled();
            });
        });

        it('should handle user role not allowed to upload files', () => {
            mockUseOrganization.mockReturnValue({ organization: { membership: { role: 'org:guest' } } });

            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            expect(screen.queryByLabelText('Upload File')).not.toBeInTheDocument();
        });

        it('should handle no assessment data', () => {
            mockUseQuery.mockImplementation((apiCall) => {
                if (apiCall === api.vehicleAssessments.getAssessment) return null;
            });

            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            expect(screen.queryByText('Assessment Result')).not.toBeInTheDocument();
        });

        it('should handle no similar vehicles data', () => {
            mockUseQuery.mockImplementation((apiCall) => {
                if (apiCall === api.vehicleAssessments.findSimilarVehicles) return [];
            });

            render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

            expect(screen.queryByText('Similar Vehicles')).not.toBeInTheDocument();
        });
    });
});

// End of unit tests for: VehicleAssessment
