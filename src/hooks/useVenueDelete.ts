import { useState } from "react";
import type useVenueDetailsForm from "./useVenueDetailsForm";

type RemoveVenue = ReturnType<typeof useVenueDetailsForm>["remove"];

const useVenueDelete = (remove: RemoveVenue, onDeleted: () => void) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startConfirm = () => setConfirmingDelete(true);
  const cancelConfirm = () => setConfirmingDelete(false);
  const reset = () => setConfirmingDelete(false);

  const confirmDelete = () => {
    setIsDeleting(true);
    remove({
      onSuccess: onDeleted,
      onSettled: () => setIsDeleting(false),
    });
  };

  return {
    confirmingDelete,
    isDeleting,
    startConfirm,
    cancelConfirm,
    reset,
    confirmDelete,
  };
};

export default useVenueDelete;
