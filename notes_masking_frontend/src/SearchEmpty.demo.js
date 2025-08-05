import React, { useState } from "react";
import SearchEmpty from "./SearchEmpty";

/**
 * Simple demo of SearchEmpty component in isolation.
 * This could be expanded into a proper routed/conditional logic in App.js.
 */
export default function DemoSearchEmptyScreen() {
  const [chip, setChip] = useState("Food Recipe");
  if (!chip) {
    // Demo: nothing to show after chip is removed
    return <div style={{
      background: 'var(--color-252525)', color: 'var(--color-cfcfcf)', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>No filter, no results!</div>;
  }
  return (
    <SearchEmpty
      label={chip}
      onClear={() => setChip(null)}
      message="File not found. Try searching again."
    />
  );
}
