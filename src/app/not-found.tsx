import { Error404 } from "@/components/ui/pixeleted-404-not-found";

export default function NotFound() {
    return (
        <Error404
            postcardImage="https://res.cloudinary.com/dap0u41dz/image/upload/v1766866944/Batman_z0yo3k.jpg"
            postcardAlt="New York City Postcard with Statue of Liberty"
            curvedTextTop="The General Intelligence"
            curvedTextBottom="of New York"
            heading="(404) Looks like the page you're looking for got lost somewhere."
            subtext="But hey — in New York, even the unexpected detours lead somewhere."
            backButtonLabel="Back to Home"
            backButtonHref="/"
        />
    );
}
