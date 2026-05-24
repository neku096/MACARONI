"use client";

import { useEffect, useState } from "react";

const storageKey = "ageConfirmed";

export function AgeGate() {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(storageKey) === "true";
      document.documentElement.classList.toggle("age-confirmed", accepted);
      document.body.classList.toggle("age-gate-open", !accepted);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAccepted(accepted);
    } catch {
      document.documentElement.classList.remove("age-confirmed");
      document.body.classList.add("age-gate-open");
    }
  }, []);

  function enterSite() {
    localStorage.setItem(storageKey, "true");
    document.documentElement.classList.add("age-confirmed");
    document.body.classList.remove("age-gate-open");
    setIsAccepted(true);
  }

  if (isAccepted) {
    return null;
  }

  return (
    <div
      className="age-gate"
      id="ageGate"
      aria-modal="true"
      role="dialog"
      aria-labelledby="ageGateTitle"
      aria-describedby="ageGateDescription"
    >
      <div className="age-panel">
        <h2 id="ageGateTitle">このサイトは18歳以上向けです</h2>
        <p id="ageGateDescription">R18作品・素材に関する情報を含みます。18歳以上の場合のみ入場してください。</p>
        <div className="age-actions">
          <button className="button primary" id="enterSite" type="button" onClick={enterSite}>
            18歳以上です
          </button>
          <a className="button ghost" href="https://www.google.com/">
            退場する
          </a>
        </div>
      </div>
    </div>
  );
}
