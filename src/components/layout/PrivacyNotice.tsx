import { useState } from "react";

const STORAGE_KEY = "privacyNoticeDismissed";

const PrivacyNotice = () => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <button
      type="button"
      className="privacy-notice"
      onClick={dismiss}
      aria-label="Dismiss privacy notice"
    >
      Your theme preference and login session will be stored locally in your
      browser. This site doesn't use any tracking or advertising cookies.{" "}
      <span className="privacy-notice-action">Got it</span>
    </button>
  );
};

export default PrivacyNotice;
