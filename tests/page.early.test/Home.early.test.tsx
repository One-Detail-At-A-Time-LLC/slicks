
// Unit tests for: Home


import { Authenticated, Unauthenticated } from 'convex/react';




import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';



import Home from '../../app/page.tsx';



// Mock the necessary components and hooks
jest.mock("convex/react", () => ({
    Authenticated: jest.fn(({ children }) => <div>{children}</div>),
    Unauthenticated: jest.fn(({ children }) => <div>{children}</div>),
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock("@clerk/nextjs", () => ({
    SignInButton: jest.fn(() => <button>Sign In</button>),
    SignUpButton: jest.fn(() => <button>Sign Up</button>),
    UserButton: jest.fn(() => <button>User</button>),
}));

jest.mock("@/components/layout/sticky-header", () => ({
    StickyHeader: jest.fn(({ children }) => <header>{children}</header>),
}));

describe('Home() Home method', () => {
    describe('Happy Path', () => {
        test('renders the main structure of the Home component', () => {
            // Render the Home component
            render(<Home />);

            // Check if the StickyHeader is rendered
            expect(screen.getByRole('banner')).toBeInTheDocument();

            // Check if the main content is rendered
            expect(screen.getByRole('main')).toBeInTheDocument();

            // Check if the heading is rendered
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Convex + Next.js + Clerk Auth');
        });

        test('renders the sign-in and sign-up buttons when unauthenticated', () => {
            // Render the Home component
            render(<Home />);

            // Check if the SignInButton and SignUpButton are rendered
            expect(screen.getByText('Sign In')).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });

        test('renders the authenticated content when authenticated', () => {
            // Mock the Authenticated component to render children
            (Authenticated as jest.Mock).mockImplementation(({ children }) => <div>{children}</div>);

            // Render the Home component
            render(<Home />);

            // Check if the authenticated content is rendered
            expect(screen.getByText('SignedInContent')).toBeInTheDocument();
        });

        test('renders the unauthenticated message when unauthenticated', () => {
            // Mock the Unauthenticated component to render children
            (Unauthenticated as jest.Mock).mockImplementation(({ children }) => <div>{children}</div>);

            // Render the Home component
            render(<Home />);

            // Check if the unauthenticated message is rendered
            expect(screen.getByText('Click one of the buttons in the top right corner to sign in.')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        test('renders without crashing when no children are passed to Authenticated and Unauthenticated', () => {
            // Mock the Authenticated and Unauthenticated components to render nothing
            (Authenticated as jest.Mock).mockImplementation(() => null);
            (Unauthenticated as jest.Mock).mockImplementation(() => null);

            // Render the Home component
            render(<Home />);

            // Check if the main structure is still rendered
            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        test('handles missing SignInButton and SignUpButton gracefully', () => {
            // Mock the SignInButton and SignUpButton to render nothing
            (SignInButton as jest.Mock).mockImplementation(() => null);
            (SignUpButton as jest.Mock).mockImplementation(() => null);

            // Render the Home component
            render(<Home />);

            // Check if the main structure is still rendered
            expect(screen.getByRole('banner')).toBeInTheDocument();
            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });
});

// End of unit tests for: Home
