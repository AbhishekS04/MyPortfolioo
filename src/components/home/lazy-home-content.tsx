'use client';

import dynamic from 'next/dynamic';
import { Project } from '@/lib/data';

// Code Split / Lazy Load below-the-fold content
const FeaturedProjects = dynamic(
  () =>
    import('@/components/home/featured-projects').then(
      (mod) => mod.FeaturedProjects,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />
    ),
  },
);
const TestimonialsMinimal = dynamic(
  () =>
    import('@/components/ui/minimal-testimonial').then(
      (mod) => mod.TestimonialsMinimal,
    ),
  { ssr: false },
);
const ContactSection = dynamic(
  () =>
    import('@/components/home/contact-section').then(
      (mod) => mod.ContactSection,
    ),
  { ssr: false },
);

interface LazyHomeContentProps {
  featuredProjects?: Project[];
}

export function LazyHomeContent({
  featuredProjects = [],
}: LazyHomeContentProps) {
  return (
    <div className="mt-32 px-4 md:px-8 max-w-[1600px] mx-auto space-y-32 pb-32">
      <FeaturedProjects initialProjects={featuredProjects} />
      {/* <TestimonialsMinimal /> */}
      <ContactSection />
    </div>
  );
}
