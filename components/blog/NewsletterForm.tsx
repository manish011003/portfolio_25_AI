"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  return (
    <form
      className="newsletter-form"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <input type="email" placeholder="you@example.com" aria-label="Your email" required />
      <button type="submit">{done ? "Subscribed ✓" : "Subscribe"}</button>
    </form>
  );
}
