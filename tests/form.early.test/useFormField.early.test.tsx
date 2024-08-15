
// Unit tests for: useFormField

import React from 'react';



import { useFormContext } from 'react-hook-form';



import { useFormField } from '../../../components/ui/form.tsx';



jest.mock("react-hook-form", () => ({
    useFormContext: jest.fn(),
}));

describe('useFormField() useFormField method', () => {
    let mockUseFormContext: jest.Mock;

    beforeEach(() => {
        mockUseFormContext = useFormContext as jest.Mock;
    });

    describe('Happy Path', () => {
        it('should return the correct field state and context values', () => {
            // Arrange
            const mockGetFieldState = jest.fn().mockReturnValue({ isDirty: true, error: null });
            const mockFormState = {};
            const mockFieldContext = { name: 'testField' };

            mockUseFormContext.mockReturnValue({
                getFieldState: mockGetFieldState,
                formState: mockFormState,
            });

            // Act
            const wrapper = () => (
                <FormFieldContext.Provider value={mockFieldContext}>
                    <FormItemContext.Provider value={mockItemContext}>
                        {children}
                    </FormItemContext.Provider>
                </FormFieldContext.Provider>
            );

            const { result } = renderHook(() => useFormField(), { wrapper });

            // Assert
            expect(result.current).toEqual({
                id: 'testId',
                name: 'testField',
                formItemId: 'testId-form-item',
                formDescriptionId: 'testId-form-item-description',
                formMessageId: 'testId-form-item-message',
                isDirty: true,
                error: null,
            });
        });
    });

    describe('Edge Cases', () => {
        it('should throw an error if used outside of FormField context', () => {
            // Arrange
            const mockGetFieldState = jest.fn();
            const mockFormState = {};

            mockUseFormContext.mockReturnValue({
                getFieldState: mockGetFieldState,
                formState: mockFormState,
            });

            // Act & Assert
            const { result } = renderHook(() => useFormField());

            expect(result.error).toEqual(new Error('useFormField should be used within <FormField>'));
        });

        it('should handle missing item context gracefully', () => {
            // Arrange
            const mockGetFieldState = jest.fn().mockReturnValue({ isDirty: true, error: null });
            const mockFormState = {};
            const mockFieldContext = { name: 'testField' };

            mockUseFormContext.mockReturnValue({
                getFieldState: mockGetFieldState,
                formState: mockFormState,
            });

            // Act
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <FormFieldContext.Provider value={mockFieldContext}>
                    {children}
                </FormFieldContext.Provider>
            );

            const { result } = renderHook(() => useFormField(), { wrapper });

            // Assert
            expect(result.current).toEqual({
                id: undefined,
                name: 'testField',
                formItemId: 'undefined-form-item',
                formDescriptionId: 'undefined-form-item-description',
                formMessageId: 'undefined-form-item-message',
                isDirty: true,
                error: null,
            });
        });

        it('should handle missing field state gracefully', () => {
            // Arrange
            const mockGetFieldState = jest.fn().mockReturnValue(undefined);
            const mockFormState = {};
            const mockFieldContext = { name: 'testField' };

            mockUseFormContext.mockReturnValue({
                getFieldState: mockGetFieldState,
                formState: mockFormState,
            });

            // Act
            const wrapper = () => (
                <FormFieldContext.Provider value={mockFieldContext}>
                    <FormItemContext.Provider value={mockItemContext}>
                        {children}
                    </FormItemContext.Provider>
                </FormFieldContext.Provider>
            );

            const { result } = renderHook(() => useFormField(), { wrapper });

            // Assert
            expect(result.current).toEqual({
                id: 'testId',
                name: 'testField',
                formItemId: 'testId-form-item',
                formDescriptionId: 'testId-form-item-description',
                formMessageId: 'testId-form-item-message',
            });
        });
    });
});

// End of unit tests for: useFormField
