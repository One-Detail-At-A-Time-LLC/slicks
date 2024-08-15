
// Unit tests for: toast

import * as React from 'react';


import { toast } from '../../../components/ui/use-toast';


// Mock types
type MockToastActionElement = {
    type: string;
    payload: any;
};

type MockToastProps = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: MockToastActionElement;
};

type MockToasterToast = MockToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: MockToastActionElement;
};

type MockState = {
    toasts: MockToasterToast[];
};

// Mock functions and variables
let mockDispatch: jest.Mock;
let mockGenId: jest.Mock;
let mockListeners: Array<(state: MockState) => void>;
let mockMemoryState: MockState;

beforeEach(() => {
    mockDispatch = jest.fn();
    mockGenId = jest.fn().mockReturnValue('1');
    mockListeners = [];
    mockMemoryState = { toasts: [] };

    jest.spyOn(global, 'setTimeout').mockImplementation((fn: Function) => {
        fn();
        return 0 as any;
    });

    jest.spyOn(global, 'clearTimeout').mockImplementation(() => { });
});

describe('toast() toast method', () => {
    // Happy path tests
    it('should add a toast with the correct properties', () => {
        const mockProps: MockToastProps = {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
        } as any;

        const result = toast(mockProps as any);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'ADD_TOAST',
            toast: {
                ...mockProps,
                id: '1',
                open: true,
                onOpenChange: expect.any(Function),
            },
        });

        expect(result).toEqual({
            id: '1',
            dismiss: expect.any(Function),
            update: expect.any(Function),
        });
    });

    it('should update a toast with new properties', () => {
        const mockProps: MockToastProps = {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
        } as any;

        const { update } = toast(mockProps as any);

        const newProps: MockToasterToast = {
            id: '1',
            title: 'Updated Title',
            description: 'Updated Description',
        } as any;

        update(newProps as any);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'UPDATE_TOAST',
            toast: { ...newProps, id: '1' },
        });
    });

    it('should dismiss a toast', () => {
        const mockProps: MockToastProps = {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
        } as any;

        const { dismiss } = toast(mockProps as any);

        dismiss();

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'DISMISS_TOAST',
            toastId: '1',
        });
    });

    // Edge case tests
    it('should handle adding a toast when the toast limit is reached', () => {
        mockMemoryState.toasts = [
            {
                id: '1',
                title: 'Existing Toast',
                description: 'Existing Description',
            } as any,
        ];

        const mockProps: MockToastProps = {
            id: '2',
            title: 'New Toast',
            description: 'New Description',
        } as any;

        toast(mockProps as any);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'REMOVE_TOAST',
            toastId: '1',
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'ADD_TOAST',
            toast: {
                ...mockProps,
                id: '2',
                open: true,
                onOpenChange: expect.any(Function),
            },
        });
    });

    it('should handle dismissing a non-existent toast', () => {
        const mockProps: MockToastProps = {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
        } as any;

        const { dismiss } = toast(mockProps as any);

        mockMemoryState.toasts = [];

        dismiss();

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'DISMISS_TOAST',
            toastId: '1',
        });
    });

    it('should handle updating a non-existent toast', () => {
        const mockProps: MockToastProps = {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
        } as any;

        const { update } = toast(mockProps as any);

        const newProps: MockToasterToast = {
            id: '1',
            title: 'Updated Title',
            description: 'Updated Description',
        } as any;

        mockMemoryState.toasts = [];

        update(newProps as any);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'UPDATE_TOAST',
            toast: { ...newProps, id: '1' },
        });
    });
});

// End of unit tests for: toast
