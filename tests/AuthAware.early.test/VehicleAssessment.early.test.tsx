
// Unit tests for: VehicleAssessment


import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex\_generated\api';
import { useUser } from '@clerk/nextjs';
import { VehicleAssessment } from '../../components/AuthAware.tsx';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';



jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock("@clerk/clerk-react", () => ({
    useUser: jest.fn(),
}));

type MockId<T extends string> = {
    id: string;
    table: T;
};

const mockGenerateUploadUrl = jest.fn();
const mockProcessVehicleImage = jest.fn();
const mockGetAssessment = jest.fn();
const mockFindSimilarVehicles = jest.fn();
const mockUseUser = jest.fn();

(useMutation as jest.Mock).mockImplementation((apiCall) => {
    switch (apiCall) {
        case api.vehicleAssessments.generateUploadUrl:
            return mockGenerateUploadUrl;
        case api.vehicleAssessments.processVehicleImage:
            return mockProcessVehicleImage;
        default:
            return jest.fn();
    }
});

(useQuery as jest.Mock).mockImplementation((apiCall, params) => {
    switch (apiCall) {
        case api.vehicleAssessments.getAssessment:
            return mockGetAssessment(params);
        case api.vehicleAssessments.findSimilarVehicles:
            return mockFindSimilarVehicles(params);
        default:
            return jest.fn();
    }
});

(useUser as jest.Mock).mockImplementation(() => mockUseUser());

describe('VehicleAssessment() VehicleAssessment method', () => {
    let mockClientId: MockId<'clients'>;
    let mockVehicleId: MockId<'vehicles'>;
    let mockUser: { fullName: string };

    beforeEach(() => {
        mockClientId = { id: 'client123', table: 'clients' } as any;
        mockVehicleId = { id: 'vehicle123', table: 'vehicles' } as any;
        mockUser = { fullName: 'John Doe' };

        mockUseUser.mockReturnValue({ user: mockUser });
        mockGenerateUploadUrl.mockResolvedValue('http://upload.url');
        mockProcessVehicleImage.mockResolvedValue({ id: 'assessment123', table: 'vehicleAssessments' } as any);
        mockGetAssessment.mockReturnValue({
            imageUrl: 'http://image.url',
            description: 'Test Description',
            condition: 'Good',
            recommendedServices: ['Service 1', 'Service 2'],
        } as any);
        mockFindSimilarVehicles.mockReturnValue([
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
        ] as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component and handle file upload (happy path)', async () => {
        render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

        expect(screen.getByText('Vehicle Assessment for John Doe')).toBeInTheDocument();
        const fileInput = screen.getByLabelText(/file/i);
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => expect(mockGenerateUploadUrl).toHaveBeenCalled());
        await waitFor(() => expect(mockProcessVehicleImage).toHaveBeenCalledWith({
            clientId: mockClientId,
            vehicleId: mockVehicleId,
            storageId: 'assessment123',
        } as any));

        expect(screen.getByText('Assessment Result')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Good')).toBeInTheDocument();
        expect(screen.getByText('Service 1')).toBeInTheDocument();
        expect(screen.getByText('Service 2')).toBeInTheDocument();
        expect(screen.getByText('Similar Vehicles')).toBeInTheDocument();
        expect(screen.getByText('Fair')).toBeInTheDocument();
        expect(screen.getByText('85.00%')).toBeInTheDocument();
        expect(screen.getByText('Good')).toBeInTheDocument();
        expect(screen.getByText('90.00%')).toBeInTheDocument();
    });

    it('should handle no user signed in (edge case)', () => {
        mockUseUser.mockReturnValue({ user: null });

        render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

        expect(screen.getByText('Please sign in to access this feature.')).toBeInTheDocument();
    });

    it('should handle no file selected (edge case)', async () => {
        render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

        const fileInput = screen.getByLabelText(/file/i);

        fireEvent.change(fileInput, { target: { files: [] } });

        await waitFor(() => expect(mockGenerateUploadUrl).not.toHaveBeenCalled());
        await waitFor(() => expect(mockProcessVehicleImage).not.toHaveBeenCalled());
    });

    it('should handle API errors gracefully (edge case)', async () => {
        mockGenerateUploadUrl.mockRejectedValue(new Error('Failed to generate upload URL'));

        render(<VehicleAssessment clientId={mockClientId} vehicleId={mockVehicleId} />);

        const fileInput = screen.getByLabelText(/file/i);
        const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => expect(mockGenerateUploadUrl).toHaveBeenCalled());
        await waitFor(() => expect(mockProcessVehicleImage).not.toHaveBeenCalled());

        // Optionally, you can check for error messages or other UI changes
    });
});

// End of unit tests for: VehicleAssessment
