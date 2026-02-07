import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProfileData, ResearchInterest, Publication, ContactInfo, UserProfile } from '@/backend';

export function useProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<ProfileData | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResearchInterests() {
  const { actor, isFetching } = useActor();

  return useQuery<ResearchInterest[]>({
    queryKey: ['researchInterests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResearchInterests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublications() {
  const { actor, isFetching } = useActor();

  return useQuery<Publication[]>({
    queryKey: ['publications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
