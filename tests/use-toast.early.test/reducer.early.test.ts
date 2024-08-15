
// Unit tests for: reducer

import * as React from 'react';

import type {
    ToastActionElement,
    ToastProps,
} from "@/components/ui/toast";

import { reducer } from '../../../components/ui/use-toast';


const TOAST_LIMIT = 1;

type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

type MockAction =
    | {
        type: ActionType["ADD_TOAST"];
        toast: ToasterToast;
    }
    | {
        type: ActionType["UPDATE_TOAST"];
        toast: Partial<ToasterToast>;
    }
    | {
        type: ActionType["DISMISS_TOAST"];
        toastId?: ToasterToast["id"];
    }
    | {
        type: ActionType["REMOVE_TOAST"];
        toastId?: ToasterToast["id"];
    };

interface State {
    toasts: ToasterToast[];
}

describe('reducer() reducer method', () => {
    let initialState: State;

    beforeEach(() => {
        initialState = { toasts: [] };
    });

    describe('Happy Path', () => {
        it('should add a toast', () => {
            const mockToast: ToasterToast = {
                id: '1',
                title: 'Test Toast',
                description: 'This is a test toast',
                open: true,
            } as any;

            const action: MockAction = {
                type: actionTypes.ADD_TOAST,
                toast: mockToast,
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(1);
            expect(newState.toasts[0]).toEqual(mockToast);
        });

        it('should update a toast', () => {
            const initialToast: ToasterToast = {
                id: '1',
                title: 'Initial Toast',
                description: 'Initial description',
                open: true,
            } as any;

            initialState.toasts.push(initialToast);

            const updatedToast: Partial<ToasterToast> = {
                id: '1',
                title: 'Updated Toast',
            } as any;

            const action: MockAction = {
                type: actionTypes.UPDATE_TOAST,
                toast: updatedToast,
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(1);
            expect(newState.toasts[0].title).toEqual('Updated Toast');
            expect(newState.toasts[0].description).toEqual('Initial description');
        });

        it('should dismiss a toast', () => {
            const initialToast: ToasterToast = {
                id: '1',
                title: 'Initial Toast',
                description: 'Initial description',
                open: true,
            } as any;

            initialState.toasts.push(initialToast);

            const action: MockAction = {
                type: actionTypes.DISMISS_TOAST,
                toastId: '1',
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(1);
            expect(newState.toasts[0].open).toBe(false);
        });

        it('should remove a toast', () => {
            const initialToast: ToasterToast = {
                id: '1',
                title: 'Initial Toast',
                description: 'Initial description',
                open: true,
            } as any;

            initialState.toasts.push(initialToast);

            const action: MockAction = {
                type: actionTypes.REMOVE_TOAST,
                toastId: '1',
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(0);
        });
    });

    describe('Edge Cases', () => {
        it('should not add more than TOAST_LIMIT toasts', () => {
            const mockToast1: ToasterToast = {
                id: '1',
                title: 'Test Toast 1',
                description: 'This is a test toast 1',
                open: true,
            } as any;

            const mockToast2: ToasterToast = {
                id: '2',
                title: 'Test Toast 2',
                description: 'This is a test toast 2',
                open: true,
            } as any;

            const action1: MockAction = {
                type: actionTypes.ADD_TOAST,
                toast: mockToast1,
            } as any;

            const action2: MockAction = {
                type: actionTypes.ADD_TOAST,
                toast: mockToast2,
            } as any;

            let newState = reducer(initialState, action1);
            newState = reducer(newState, action2);

            expect(newState.toasts).toHaveLength(TOAST_LIMIT);
            expect(newState.toasts[0]).toEqual(mockToast2);
        });

        it('should handle dismissing all toasts when toastId is undefined', () => {
            const initialToast1: ToasterToast = {
                id: '1',
                title: 'Initial Toast 1',
                description: 'Initial description 1',
                open: true,
            } as any;

            const initialToast2: ToasterToast = {
                id: '2',
                title: 'Initial Toast 2',
                description: 'Initial description 2',
                open: true,
            } as any;

            initialState.toasts.push(initialToast1, initialToast2);

            const action: MockAction = {
                type: actionTypes.DISMISS_TOAST,
                toastId: undefined,
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(2);
            expect(newState.toasts[0].open).toBe(false);
            expect(newState.toasts[1].open).toBe(false);
        });

        it('should handle removing all toasts when toastId is undefined', () => {
            const initialToast1: ToasterToast = {
                id: '1',
                title: 'Initial Toast 1',
                description: 'Initial description 1',
                open: true,
            } as any;

            const initialToast2: ToasterToast = {
                id: '2',
                title: 'Initial Toast 2',
                description: 'Initial description 2',
                open: true,
            } as any;

            initialState.toasts.push(initialToast1, initialToast2);

            const action: MockAction = {
                type: actionTypes.REMOVE_TOAST,
                toastId: undefined,
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(0);
        });

        it('should handle updating a non-existent toast', () => {
            const updatedToast: Partial<ToasterToast> = {
                id: 'non-existent-id',
                title: 'Updated Toast',
            } as any;

            const action: MockAction = {
                type: actionTypes.UPDATE_TOAST,
                toast: updatedToast,
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(0);
        });

        it('should handle dismissing a non-existent toast', () => {
            const action: MockAction = {
                type: actionTypes.DISMISS_TOAST,
                toastId: 'non-existent-id',
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(0);
        });

        it('should handle removing a non-existent toast', () => {
            const action: MockAction = {
                type: actionTypes.REMOVE_TOAST,
                toastId: 'non-existent-id',
            } as any;

            const newState = reducer(initialState, action);

            expect(newState.toasts).toHaveLength(0);
        });
    });
});

// End of unit tests for: reducer
