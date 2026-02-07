import { Skeleton } from '@/components/ui/skeleton';
import type { ProfileData } from '@/backend';

interface HeroSectionProps {
  profile: ProfileData | null | undefined;
  isLoading: boolean;
}

export default function HeroSection({ profile, isLoading }: HeroSectionProps) {
  if (isLoading) {
    return (
      <section id="about" className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-[300px_1fr] md:gap-16">
              <div className="flex justify-center md:justify-start">
                <Skeleton className="h-[400px] w-[300px] rounded-lg" />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section id="about" className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-muted-foreground">No profile information available. Please log in to add your profile.</p>
          </div>
        </div>
      </section>
    );
  }

  const photoUrl = profile.photo?.getDirectURL();

  return (
    <section id="about" className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-[300px_1fr] md:gap-16">
            <div className="flex justify-center md:justify-start">
              {photoUrl ? (
                <div className="overflow-hidden rounded-lg border border-border shadow-lg">
                  <img
                    src={photoUrl}
                    alt={profile.name}
                    className="h-[400px] w-[300px] object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[400px] w-[300px] items-center justify-center rounded-lg border border-border bg-muted">
                  <span className="text-6xl font-bold text-muted-foreground">
                    {profile.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h2>
                <div className="mt-2 h-1 w-20 bg-primary" />
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">{profile.biography}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
