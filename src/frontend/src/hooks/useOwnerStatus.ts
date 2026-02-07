import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useOwnerStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const query = useQuery<boolean>({
    queryKey: ['isOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isOwner();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || isInitializing || query.isLoading,
    isOwner: query.data === true,
    isAuthenticated,
  };
}
