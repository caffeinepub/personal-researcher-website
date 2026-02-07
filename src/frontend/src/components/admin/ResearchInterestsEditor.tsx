import { useState } from 'react';
import { useResearchInterests } from '@/hooks/useQueries';
import { useAddResearchInterest, useDeleteResearchInterest } from '@/hooks/useMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ResearchInterestsEditor() {
  const { data: interests } = useResearchInterests();
  const addInterest = useAddResearchInterest();
  const deleteInterest = useDeleteResearchInterest();

  const [newInterest, setNewInterest] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim()) {
      await addInterest.mutateAsync(newInterest.trim());
      setNewInterest('');
    }
  };

  const handleDelete = (interestId: string) => {
    deleteInterest.mutate(interestId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Research Interest</CardTitle>
          <CardDescription>Add a new area of research expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="e.g., Machine Learning"
                required
              />
            </div>
            <Button type="submit" disabled={addInterest.isPending}>
              {addInterest.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Research Interests</CardTitle>
          <CardDescription>
            {interests && interests.length > 0
              ? 'Click the X to remove an interest'
              : 'No research interests added yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interests?.map((interest) => (
              <Badge key={interest.id} variant="secondary" className="gap-2 px-3 py-1.5 text-sm">
                {interest.name}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="ml-1 rounded-full hover:bg-destructive/20"
                      disabled={deleteInterest.isPending}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Research Interest</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{interest.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(interest.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
