import { useState, useSyncExternalStore } from "react";

const getModalOpen = () => document.body.classList.contains("modal-open");

const subscribeToModalState = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const useCountAfterModalClose = (value: number) => {
  const isModalOpen = useSyncExternalStore(
    subscribeToModalState,
    getModalOpen,
    () => false,
  );

  const [displayed, setDisplayed] = useState(value);

  if (!isModalOpen && displayed !== value) {
    setDisplayed(value);
  }

  return displayed;
};

export default useCountAfterModalClose;
