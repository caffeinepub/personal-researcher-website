import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import type { Publication } from '@/backend';

interface PublicationsSectionProps {
  publications: Publication[] | undefined;
  isLoading: boolean;
}

export default function PublicationsSection({ publications, isLoading }: PublicationsSectionProps) {
  if (isLoading) {
    return (
      <section id="publications" className="border-b border-border/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-4 h-10 w-64" />
            <Skeleton className="mb-12 h-4 w-96" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <section id="publications" className="border-b border-border/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight">Publications</h2>
              </div>
              <p className="text-muted-foreground">
                No publications available at this time.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="publications" className="border-b border-border/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Publications</h2>
            </div>
            <p className="text-muted-foreground">
              Selected research papers and academic contributions
            </p>
          </div>
          <div className="space-y-6">
            {publications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PublicationCard({ publication }: { publication: Publication }) {
  const pdfUrl = publication.pdf?.getDirectURL();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{publication.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {publication.description}
        </CardDescription>
      </CardHeader>
      {(publication.link || pdfUrl) && (
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {publication.link && (
              <Button variant="outline" size="sm" asChild>
                <a href={publication.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Paper
                </a>
              </Button>
            )}
            {pdfUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
