import { Error404 } from "@/components/ui/pixeleted-404-not-found";

export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <Error404
            // postcardImage="https://res.cloudinary.com/dap0u41dz/image/upload/v1766866944/Batman_z0yo3k.jpg"
            postcardImage="https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/df3cf166-3366-45c3-907f-218183b63d3e.jpg"
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
