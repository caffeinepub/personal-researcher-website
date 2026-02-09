import { useState, useEffect } from 'react';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useSaveCallerUserProfile } from '@/hooks/useMutations';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';

interface PersonalInfoEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PersonalInfoEditorSheet({
  open,
  onOpenChange,
}: PersonalInfoEditorSheetProps) {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();
  const [name, setName] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    } else {
      setName('');
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    try {
      await saveMutation.mutateAsync({ name: name.trim() });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </SheetTitle>
          <SheetDescription>
            Update your personal information. This is how you'll be identified in the system.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={profileLoading || saveMutation.isPending}
              required
            />
            <p className="text-sm text-muted-foreground">
              Your display name for the application.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={profileLoading || saveMutation.isPending || !name.trim()}
              className="flex-1"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
