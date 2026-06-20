import { useState } from "react";

type Acting = { id: string; action: string };

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
