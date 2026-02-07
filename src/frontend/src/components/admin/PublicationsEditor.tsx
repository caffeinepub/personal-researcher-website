import { useState } from 'react';
import { usePublications } from '@/hooks/useQueries';
import { useAddPublication, useDeletePublication, useUpdatePublication } from '@/hooks/useMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Upload, X, Edit2, FileText } from 'lucide-react';
import { ExternalBlob } from '@/backend';
import type { Publication } from '@/backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PublicationsEditor() {
  const { data: publications } = usePublications();
  const addPublication = useAddPublication();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let pdfBlob: ExternalBlob | null = null;
    if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      pdfBlob = ExternalBlob.fromBytes(uint8Array);
    }

    await addPublication.mutateAsync({
      title,
      description,
      link: link.trim() || null,
      pdf: pdfBlob,
    });

    setTitle('');
    setDescription('');
    setLink('');
    setPdfFile(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Publication</CardTitle>
          <CardDescription>Add a new research paper or publication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pub-title">Title</Label>
              <Input
                id="pub-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Publication title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-description">Description</Label>
              <Textarea
                id="pub-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the publication"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-link">External Link (optional)</Label>
              <Input
                id="pub-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-pdf">PDF File (optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="pub-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <Label
                  htmlFor="pub-pdf"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Upload className="h-4 w-4" />
                  {pdfFile ? pdfFile.name : 'Upload PDF'}
                </Label>
                {pdfFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPdfFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Button type="submit" disabled={addPublication.isPending} className="w-full">
              {addPublication.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Publication
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Publications</CardTitle>
          <CardDescription>
            {publications && publications.length > 0
              ? 'Edit or delete existing publications'
              : 'No publications added yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publications?.map((publication) => (
              <PublicationItem key={publication.id} publication={publication} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PublicationItem({ publication }: { publication: Publication }) {
  const deletePublication = useDeletePublication();
  const updatePublication = useUpdatePublication();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(publication.title);
  const [description, setDescription] = useState(publication.description);
  const [link, setLink] = useState(publication.link || '');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [removePdf, setRemovePdf] = useState(false);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setRemovePdf(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let pdfBlob: ExternalBlob | null = null;

    if (removePdf) {
      pdfBlob = null;
    } else if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      pdfBlob = ExternalBlob.fromBytes(uint8Array);
    } else if (publication.pdf) {
      pdfBlob = publication.pdf;
    }

    await updatePublication.mutateAsync({
      publicationId: publication.id,
      title,
      description,
      link: link.trim() || null,
      pdf: pdfBlob,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    deletePublication.mutate(publication.id);
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold">{publication.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{publication.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {publication.link && <span>Has link</span>}
            {publication.pdf && (
              <>
                {publication.link && <span>•</span>}
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  PDF attached
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Publication</DialogTitle>
                <DialogDescription>Update publication details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-title-${publication.id}`}>Title</Label>
                  <Input
                    id={`edit-title-${publication.id}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-desc-${publication.id}`}>Description</Label>
                  <Textarea
                    id={`edit-desc-${publication.id}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-link-${publication.id}`}>External Link</Label>
                  <Input
                    id={`edit-link-${publication.id}`}
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>PDF File</Label>
                  {publication.pdf && !removePdf && !pdfFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">PDF attached</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRemovePdf(true)}
                      >
                        Remove PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Input
                        id={`edit-pdf-${publication.id}`}
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor={`edit-pdf-${publication.id}`}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload className="h-4 w-4" />
                        {pdfFile ? pdfFile.name : 'Upload PDF'}
                      </Label>
                      {pdfFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setPdfFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updatePublication.isPending}>
                    {updatePublication.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" disabled={deletePublication.isPending}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Publication</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{publication.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
