import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Abhishek Singh | Portfolio',
        short_name: 'Abhishek',
        description: 'Frontend Engineer & UI System Designer',
        start_url: '/',
        display: 'standalone',
        background_color: '#050805',
        theme_color: '#050805',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
