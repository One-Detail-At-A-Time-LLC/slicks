
// Unit tests for: useToast



import { useToast } from '../../../components/ui/use-toast';


describe('useToast() useToast method', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Happy Path Tests
    describe('Happy Path', () => {
        it('should add a toast correctly', () => {
            const { result } = renderHook(() => useToast());

            const newToast = {
                id: '1',
                title: 'Test Toast',
                description: 'This is a test toast',
            };

            act(() => {
                result.current.toast(newToast);
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0]).toMatchObject(newToast);
        });

        it('should dismiss a toast correctly', () => {
            const { result } = renderHook(() => useToast());

            const newToast = {
                id: '1',
                title: 'Test Toast',
                description: 'This is a test toast',
            };

            act(() => {
                result.current.toast(newToast);
            });

            act(() => {
                result.current.dismiss('1');
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should update a toast correctly', () => {
            const { result } = renderHook(() => useToast());

            const newToast = {
                id: '1',
                title: 'Test Toast',
                description: 'This is a test toast',
            };

            act(() => {
                result.current.toast(newToast);
            });

            const updatedToast = {
                id: '1',
                title: 'Updated Toast',
            };

            act(() => {
                result.current.toast(updatedToast);
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0].title).toBe('Updated Toast');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should handle dismissing a non-existent toast gracefully', () => {
            const { result } = renderHook(() => useToast());

            act(() => {
                result.current.dismiss('non-existent-id');
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should handle adding a toast when the limit is reached', () => {
            const { result } = renderHook(() => useToast());

            const firstToast = {
                id: '1',
                title: 'First Toast',
                description: 'This is the first toast',
            };

            const secondToast = {
                id: '2',
                title: 'Second Toast',
                description: 'This is the second toast',
            };

            act(() => {
                result.current.toast(firstToast);
            });

            act(() => {
                result.current.toast(secondToast);
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0]).toMatchObject(secondToast);
        });

        it('should handle updating a non-existent toast gracefully', () => {
            const { result } = renderHook(() => useToast());

            const updatedToast = {
                id: 'non-existent-id',
                title: 'Updated Toast',
            };

            act(() => {
                result.current.toast(updatedToast);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should remove a toast after the specified delay', () => {
            jest.useFakeTimers();
            const { result } = renderHook(() => useToast());

            const newToast = {
                id: '1',
                title: 'Test Toast',
                description: 'This is a test toast',
            };

            act(() => {
                result.current.toast(newToast);
            });

            expect(result.current.toasts).toHaveLength(1);

            act(() => {
                jest.advanceTimersByTime(TOAST_REMOVE_DELAY);
            });

            expect(result.current.toasts).toHaveLength(0);
            jest.useRealTimers();
        });
    });
});

// End of unit tests for: useToast
