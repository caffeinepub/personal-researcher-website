import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useQueries';
import { useSetProfile } from '@/hooks/useMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, X } from 'lucide-react';
import { ExternalBlob } from '@/backend';

export default function ProfileEditForm() {
  const { data: profile } = useProfile();
  const setProfile = useSetProfile();

  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBiography(profile.biography || '');
      if (profile.photo && !removePhoto) {
        setPhotoPreview(profile.photo.getDirectURL());
      }
    }
  }, [profile, removePhoto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setRemovePhoto(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let photoBlob: ExternalBlob | null = null;

    if (removePhoto) {
      photoBlob = null;
    } else if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      photoBlob = ExternalBlob.fromBytes(uint8Array);
    } else if (profile?.photo) {
      photoBlob = profile.photo;
    }

    setProfile.mutate({ name, biography, photo: photoBlob });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your name, biography, and photo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Tell us about yourself and your research"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Photo</Label>
            {photoPreview && !removePhoto ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-48 w-36 rounded-lg border object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Label
                  htmlFor="photo"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Label>
              </div>
            )}
          </div>

          <Button type="submit" disabled={setProfile.isPending} className="w-full">
            {setProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
