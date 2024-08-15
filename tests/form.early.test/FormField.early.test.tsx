
// Unit tests for: FormField

import React from 'react';



import { FormProvider, useFormContext } from 'react-hook-form';



import { FormField } from '../../../components/ui/form.tsx';

import { render } from '@testing-library/react';


// Mocking useFormContext to provide necessary context for the tests
jest.mock("react-hook-form", () => ({
    ...jest.requireActual("react-hook-form"),
    useFormContext: jest.fn(),
}));

describe('FormField() FormField method', () => {
    let mockUseFormContext: jest.Mock;

    beforeEach(() => {
        mockUseFormContext = useFormContext as jest.Mock;
        mockUseFormContext.mockReturnValue({
            getFieldState: jest.fn().mockReturnValue({}),
            formState: {},
        });
    });

    describe('Happy Path', () => {
        test('should render FormField with provided props', () => {
            // Arrange: Set up the props and context values
            const props = {
                name: 'testField',
                control: {},
                render: jest.fn(),
            };

            // Act: Render the FormField component
            const { getByText } = render(
                <FormProvider {...props}>
                    <FormField {...props} />
                </FormProvider>
            );

            // Assert: Check if the Controller is rendered with the correct props
            expect(props.render).toHaveBeenCalled();
        });

        test('should provide correct context value', () => {
            // Arrange: Set up the props and context values
            const props = {
                name: 'testField',
                control: {},
                render: jest.fn(),
            };

            // Act: Render the FormField component
            const { getByText } = render(
                <FormProvider {...props}>
                    <FormField {...props} />
                </FormProvider>
            );

            // Assert: Check if the context value is correctly set
            expect(React.useContext(FormFieldContext)).toEqual({ name: 'testField' });
        });
    });

    describe('Edge Cases', () => {
        test('should throw error if useFormField is used outside of FormField', () => {
            // Arrange: Mock the context to return undefined
            jest.spyOn(React, 'useContext').mockReturnValueOnce(undefined);

            // Act & Assert: Expect an error to be thrown
            expect(() => {
                render(<FormField name="testField" control={{}} render={jest.fn()} />);
            }).toThrow('useFormField should be used within <FormField>');
        });

        test('should handle empty name prop gracefully', () => {
            // Arrange: Set up the props with an empty name
            const props = {
                name: '',
                control: {},
                render: jest.fn(),
            };

            // Act: Render the FormField component
            const { getByText } = render(
                <FormProvider {...props}>
                    <FormField {...props} />
                </FormProvider>
            );

            // Assert: Check if the Controller is rendered with the correct props
            expect(props.render).toHaveBeenCalled();
        });

        test('should handle missing control prop gracefully', () => {
            // Arrange: Set up the props without control
            const props = {
                name: 'testField',
                render: jest.fn(),
            };

            // Act: Render the FormField component
            const { getByText } = render(
                <FormProvider {...props}>
                    <FormField {...props} />
                </FormProvider>
            );

            // Assert: Check if the Controller is rendered with the correct props
            expect(props.render).toHaveBeenCalled();
        });
    });
});

// End of unit tests for: FormField
