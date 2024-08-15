
// Unit tests for: VehicleAssessment


import { useMutation, useQuery } from 'convex/react';

import { api } from 'convex\_generated\api';

import { Id } from 'convex\_generated\dataModel';

import { VehicleAssessment } from '../../components/SimularVehicle.tsx';

import { fireEvent, render, waitFor } from '@testing-library/react';



interface MockVehicleAssessmentProps {
    clientId: Id<"clients">;
    vehicleId: Id<"vehicles">;
}

jest.mock("convex/react", () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

const mockGenerateUploadUrl = jest.fn();
const mockProcessVehicleImage = jest.fn();
const mockGetAssessment = jest.fn();
const mockFindSimilarVehicles = jest.fn();
const mockGetSimilarVehicleRecommendations = jest.fn();

(useMutation as jest.Mock).mockImplementation((apiCall) => {
    if (apiCall === api.vehicleAssessments.generateUploadUrl) {
        return mockGenerateUploadUrl;
    }
    if (apiCall === api.vehicleAssessments.processVehicleImage) {
        return mockProcessVehicleImage;
    }
    return jest.fn();
});

(useQuery as jest.Mock).mockImplementation((apiCall, params) => {
    if (apiCall === api.vehicleAssessments.getAssessment) {
        return mockGetAssessment(params);
    }
    if (apiCall === api.vehicleAssessments.findSimilarVehicles) {
        return mockFindSimilarVehicles(params);
    }
    if (apiCall === api.vehicleAssessments.getSimilarVehicleRecommendations) {
        return mockGetSimilarVehicleRecommendations(params);
    }
    return jest.fn();
});

describe('VehicleAssessment() VehicleAssessment method', () => {
    let mockProps: MockVehicleAssessmentProps;

    beforeEach(() => {
        mockProps = {
            clientId: 'mockClientId' as any,
            vehicleId: 'mockVehicleId' as any,
        };

        mockGenerateUploadUrl.mockReset();
        mockProcessVehicleImage.mockReset();
        mockGetAssessment.mockReset();
        mockFindSimilarVehicles.mockReset();
        mockGetSimilarVehicleRecommendations.mockReset();
    });

    describe('Happy Path', () => {
        it('should render the component and handle file upload successfully', async () => {
            // Arrange
            mockGenerateUploadUrl.mockResolvedValue('mockUploadUrl' as any as never);
            mockProcessVehicleImage.mockResolvedValue('mockAssessmentId' as any as never);
            mockGetAssessment.mockReturnValue({
                imageUrl: 'mockImageUrl',
                description: 'mockDescription',
                condition: 'mockCondition',
                recommendedServices: ['service1', 'service2'],
            } as any);
            mockFindSimilarVehicles.mockReturnValue([
                { Id: 'vehicle1', imageUrl: 'vehicle1Url', condition: 'good', similarity: 0.9 },
                { Id: 'vehicle2', imageUrl: 'vehicle2Url', condition: 'fair', similarity: 0.8 },
                { Id: 'vehicle3', imageUrl: 'vehicle3Url', condition: 'poor', similarity: 0.7 },
            ] as any);
            mockGetSimilarVehicleRecommendations.mockReturnValue('mockRecommendations' as any);

            const { getByText, getByLabelText, getByAltText } = render(<VehicleAssessment {...mockProps as any} />);

            // Act
            const fileInput = getByLabelText(/upload/i);
            const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            // Assert
            await waitFor(() => expect(mockGenerateUploadUrl).toHaveBeenCalled());
            await waitFor(() => expect(mockProcessVehicleImage).toHaveBeenCalledWith({
                clientId: 'mockClientId',
                vehicleId: 'mockVehicleId',
                storageId: 'mockStorageId',
            } as any));
            expect(getByText(/Assessment Result/i)).toBeInTheDocument();
            expect(getByAltText(/Assessed vehicle/i)).toHaveAttribute('src', 'mockImageUrl');
            expect(getByText(/mockDescription/i)).toBeInTheDocument();
            expect(getByText(/mockCondition/i)).toBeInTheDocument();
            expect(getByText(/service1/i)).toBeInTheDocument();
            expect(getByText(/service2/i)).toBeInTheDocument();
            expect(getByText(/Similar Vehicles/i)).toBeInTheDocument();
            expect(getByAltText(/Similar vehicle 1/i)).toHaveAttribute('src', 'vehicle1Url');
            expect(getByAltText(/Similar vehicle 2/i)).toHaveAttribute('src', 'vehicle2Url');
            expect(getByAltText(/Similar vehicle 3/i)).toHaveAttribute('src', 'vehicle3Url');
            expect(getByText(/Recommendations Based on Similar Vehicles/i)).toBeInTheDocument();
            expect(getByText(/mockRecommendations/i)).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle no file selected', async () => {
            // Arrange
            const { getByLabelText } = render(<VehicleAssessment {...mockProps as any} />);

            // Act
            const fileInput = getByLabelText(/upload/i);
            fireEvent.change(fileInput, { target: { files: [] } });

            // Assert
            await waitFor(() => expect(mockGenerateUploadUrl).not.toHaveBeenCalled());
            await waitFor(() => expect(mockProcessVehicleImage).not.toHaveBeenCalled());
        });

        it('should handle file upload failure', async () => {
            // Arrange
            mockGenerateUploadUrl.mockRejectedValue(new Error('Upload URL generation failed') as never);
            const { getByLabelText } = render(<VehicleAssessment {...mockProps as any} />);

            // Act
            const fileInput = getByLabelText(/upload/i);
            const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            // Assert
            await waitFor(() => expect(mockGenerateUploadUrl).toHaveBeenCalled());
            await waitFor(() => expect(mockProcessVehicleImage).not.toHaveBeenCalled());
        });

        it('should handle image processing failure', async () => {
            // Arrange
            mockGenerateUploadUrl.mockResolvedValue('mockUploadUrl' as any as never);
            mockProcessVehicleImage.mockRejectedValue(new Error('Image processing failed') as never);
            const { getByLabelText } = render(<VehicleAssessment {...mockProps as any} />);

            // Act
            const fileInput = getByLabelText(/upload/i);
            const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            // Assert
            await waitFor(() => expect(mockGenerateUploadUrl).toHaveBeenCalled());
            await waitFor(() => expect(mockProcessVehicleImage).toHaveBeenCalled());
        });
    });
});

// End of unit tests for: VehicleAssessment
