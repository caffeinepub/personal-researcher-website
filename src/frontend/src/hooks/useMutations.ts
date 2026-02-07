import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

export function useSetProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      biography,
      photo,
    }: {
      name: string;
      biography: string;
      photo: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProfile(name, biography, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useAddResearchInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addResearchInterest(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchInterests'] });
      toast.success('Research interest added');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add research interest');
    },
  });
}

export function useDeleteResearchInterest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interestId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteResearchInterest(interestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchInterests'] });
      toast.success('Research interest deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete research interest');
    },
  });
}

export function useAddPublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      link,
      pdf,
    }: {
      title: string;
      description: string;
      link: string | null;
      pdf: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPublication(title, description, link, pdf);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add publication');
    },
  });
}

export function useDeletePublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publicationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePublication(publicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete publication');
    },
  });
}

export function useUpdatePublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      publicationId,
      title,
      description,
      link,
      pdf,
    }: {
      publicationId: string;
      title: string;
      description: string;
      link: string | null;
      pdf: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePublication(publicationId, title, description, link, pdf);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success('Publication updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update publication');
    },
  });
}

export function useSetContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, affiliation }: { email: string; affiliation: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setContactInfo(email, affiliation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      toast.success('Contact information updated');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update contact information';
      toast.error(message);
    },
  });
}
