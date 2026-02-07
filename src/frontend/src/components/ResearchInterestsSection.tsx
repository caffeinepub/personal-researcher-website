import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import type { ResearchInterest } from '@/backend';

interface ResearchInterestsSectionProps {
  interests: ResearchInterest[] | undefined;
  isLoading: boolean;
}

export default function ResearchInterestsSection({ interests, isLoading }: ResearchInterestsSectionProps) {
  if (isLoading) {
    return (
      <section id="research" className="border-b border-border/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-4 h-10 w-64" />
            <Skeleton className="mb-8 h-4 w-96" />
            <div className="flex flex-wrap gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <section id="research" className="border-b border-border/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Research Interests</h2>
            </div>
            <p className="text-muted-foreground">
              Key areas of expertise and ongoing research focus
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest) => (
              <Badge
                key={interest.id}
                variant="secondary"
                className="px-4 py-2 text-base font-medium"
              >
                {interest.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
