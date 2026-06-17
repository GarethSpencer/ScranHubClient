import { useState } from "react";

type Acting = { id: string; action: string };

/**
 * Tracks which row + action is currently in flight in a table, so the clicked
 * button can show a spinner while the rest stay disabled.
 *
 * Usage:
 *   const { isActing, mutationCallbacks } = useActingState();
 *   ...
 *   onClick={() =>
 *     deleteMutate(id, mutationCallbacks(id, "delete", { onSuccess }))
 *   }
 *   ...
 *   {isActing(id, "delete") ? <Spinner … /> : "Delete"}
 *
 * Any onSuccess/onError passed in is preserved; onSettled is owned here so the
 * spinner always clears, even on failure.
 */
const useActingState = () => {
  const [acting, setActing] = useState<Acting | null>(null);

  const isActing = (id: string, action: string) =>
    acting?.id === id && acting.action === action;

  const mutationCallbacks = (
    id: string,
    action: string,
    callbacks?: { onSuccess?: () => void; onError?: () => void },
  ) => {
    setActing({ id, action });
    return {
      ...callbacks,
      onSettled: () => setActing(null),
    };
  };

  return { isActing, mutationCallbacks };
};

export default useActingState;
