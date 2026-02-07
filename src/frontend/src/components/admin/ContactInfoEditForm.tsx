import { useState, useEffect } from 'react';
import { useContactInfo } from '@/hooks/useQueries';
import { useSetContactInfo } from '@/hooks/useMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ContactInfoEditForm() {
  const { data: contactInfo } = useContactInfo();
  const setContactInfo = useSetContactInfo();

  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');

  useEffect(() => {
    if (contactInfo) {
      setEmail(contactInfo.email || '');
      setAffiliation(contactInfo.affiliation || '');
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo.mutate({ email, affiliation });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Update your email and institutional affiliation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@institution.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation">Institutional Affiliation</Label>
            <Input
              id="affiliation"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="University or Research Institution"
              required
            />
          </div>

          <Button type="submit" disabled={setContactInfo.isPending} className="w-full">
            {setContactInfo.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Contact Info'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
