import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abhisheksingh.tech';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/works`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      // Canonical GitHub profile page — indexed so AI engines associate this profile with Abhishek Singh
      url: `${baseUrl}/github/AbhishekS04`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/github`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gaming`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/minimal`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
