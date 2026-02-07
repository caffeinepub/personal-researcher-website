import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Building2 } from 'lucide-react';
import type { ContactInfo } from '@/backend';

interface ContactSectionProps {
  contactInfo: ContactInfo | null | undefined;
  isLoading: boolean;
}

export default function ContactSection({ contactInfo, isLoading }: ContactSectionProps) {
  if (isLoading) {
    return (
      <section id="contact" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-4 h-10 w-64" />
            <Skeleton className="mb-12 h-4 w-96" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!contactInfo) {
    return null;
  }

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Feel free to reach out for collaborations or inquiries
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Affiliation</h3>
                  <p className="text-muted-foreground">{contactInfo.affiliation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
