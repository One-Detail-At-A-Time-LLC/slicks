// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isClientRoute = createRouteMatcher(['/client(.*)'])
const isManagerRoute = createRouteMatcher(['/manager(.*)'])

export default clerkMiddleware((auth, req) => {
    // Restrict admin routes to users with AdminCreator role
    if (isAdminRoute(req)) auth().protect({ role: 'org:admin' })

    // Restrict manager routes to users with Management role
    if (isManagerRoute(req)) auth().protect({ role: 'org:manager_organization' })

    // Restrict client routes to users with Client role
    if (isClientRoute(req)) auth().protect({ role: 'org:clients' })

    // Restrict dashboard routes to signed in users with at least MemberVerified role
    if (isDashboardRoute(req)) auth().protect({ role: ['org:member', 'org:manager_organization', 'org:admin'] })
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}