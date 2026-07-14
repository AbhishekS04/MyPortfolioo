import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ProjectDetailsView } from '@/components/works/project-details-view';
import { Metadata } from 'next';

interface WorksDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: WorksDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };

  const projectUrl = `https://abhisheksingh.tech/works/${slug}`;
  const imageUrl = project.main_image_url || '/og-image.jpg';

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.description,
      url: projectUrl,
      siteName: 'Abhishek Singh Portfolio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Case Study`,
      description: project.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: projectUrl,
    },
  };
}

export default async function ProjectDetailPage({ params }: WorksDetailProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  if (project.is_coming_soon) {
    redirect('/works');
  }

  const { data: contributors } = await supabase
    .from('project_contributors')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true });

  const projectUrl = `https://abhisheksingh.tech/works/${slug}`;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: projectUrl,
    author: {
      '@type': 'Person',
      name: 'Abhishek Singh',
      url: 'https://abhisheksingh.tech',
    },
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://abhisheksingh.tech',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Works',
        item: 'https://abhisheksingh.tech/works',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return (
    <Suspense fallback={null}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetailsView project={project} contributors={contributors || []} />
    </Suspense>
  );
}
