import { useState } from "react";
import type useVenueRatingsForm from "./useVenueRatingsForm";

type RemoveRatings = ReturnType<typeof useVenueRatingsForm>["remove"];

const useVenueRatingsRemove = (
  removeRatings: RemoveRatings,
  onRemoved: () => void,
) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const remove = async () => {
    setIsRemoving(true);
    try {
      await removeRatings();
      onRemoved();
    } catch {
      // A failed mutation already surfaces its own error toast; leave the
      // ratings as they are so the user can retry.
    } finally {
      setIsRemoving(false);
    }
  };

  return { isRemoving, remove };
};

export default useVenueRatingsRemove;
