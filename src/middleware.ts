import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/"])
const isFarmerPage = createRouteMatcher(["/farmer/*"])
const isStakeholderPage = createRouteMatcher(["/stakeholder/*"])

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    if (isAuthPage(request) && convexAuth.isAuthenticated()) {
        return nextjsMiddlewareRedirect(request, "/")
    }

    if (!convexAuth.isAuthenticated()) {
        if (isFarmerPage(request) || isStakeholderPage(request)) {
            return nextjsMiddlewareRedirect(request, "/")
        }
        return;
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};