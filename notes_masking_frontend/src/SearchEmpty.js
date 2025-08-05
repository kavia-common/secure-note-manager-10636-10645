import React from 'react';
import './App.css';

/**
 * SearchEmpty - Empty state UI for the search-not-found scenario.
 * Design based on Figma extraction screen_111:16 (Searching Note Empty).
 * 
 * Props:
 *   label (string) - text for the search chip
 *   onClear (function) - handler for clearing/removing the chip
 *   message (string) - empty state message (default: "File not found. Try searching again.")
 *   ...rest - future extensibility for illustration overrides etc.
 */
function SearchEmpty({
  label = "Food Recipe",
  onClear,
  message = "File not found. Try searching again.",
}) {
  // Figma image asset URLs
  const iconUrl = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a896eeb6-ddb1-48ca-9cc4-c25db7d10b1b";
  const closeUrl = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d351ab2c-0590-4123-9ab8-e8765b19afe2";
  const illustUrl = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c16d1e81-e94f-4736-a81e-58f2599d762f";

  return (
    <div className="search-empty-frame" style={{
      position: 'relative',
      background: "var(--color-252525)",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end"
    }}>
      {/* Button chip block */}
      <div className="search-food-btn" style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        width: 360, height: 50,
        borderRadius: "var(--radius-30)",
        background: "var(--color-3b3b3b)",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
        zIndex: 10,
        paddingLeft: "var(--spacing-20)",
        paddingRight: "var(--spacing-16)",
        gap: "var(--spacing-16)"
      }}>
        <span className="search-food-icon" style={{ marginRight: 8 }}>
          <img src={iconUrl} alt="icon" width={27} height={27} />
        </span>
        <span className="search-food-text" style={{
          fontFamily: "var(--typo-26-family)",
          fontSize: "var(--typo-26-size)",
          fontWeight: "var(--typo-26-weight)",
          color: "var(--color-cccccc)",
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: "0.1px"
        }}>
          {label}
        </span>
        <span className="search-food-close" style={{ marginLeft: 'auto', cursor: 'pointer' }}>
          <img
            src={closeUrl}
            alt="close"
            width={24} height={24}
            tabIndex={0}
            aria-label="Clear"
            onClick={onClear}
            style={{ display: 'block' }}
          />
        </span>
      </div>
      {/* Illustration centered above button */}
      <div className="search-empty-illustration" style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 130,
        width: 370, maxWidth: "90vw", height: 240,
        display: "flex", justifyContent: "center", alignItems: "flex-end", zIndex: 2
      }}>
        <img src={illustUrl} alt="File search illustration" style={{
          width: "100%", height: "auto", borderRadius: "var(--radius-10)"
        }} />
      </div>
      {/* Empty state message */}
      <div className="search-empty-message" style={{
        position: "absolute",
        left: "50%",
        bottom: 30,
        transform: "translateX(-50%)",
        width: 313,
        height: 27,
        color: "var(--color-ffffff)",
        fontFamily: "var(--typo-15-family)",
        fontSize: "var(--typo-15-size)",
        fontWeight: "var(--typo-15-weight)",
        lineHeight: "var(--typo-15-line-height)",
        textAlign: "center",
        letterSpacing: "0.02em",
        zIndex: 15,
        whiteSpace: "nowrap"
      }}>
        {message}
      </div>
    </div>
  );
}

export default SearchEmpty;
