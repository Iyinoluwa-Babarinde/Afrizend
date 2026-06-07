import React from 'react';

export default function Logo({ scale = 1, forceWhite = false, color = null }) {
  const brandGreen = "#15803d";
  const textColor = forceWhite ? "white" : (color || brandGreen);
  const subtextColor = forceWhite ? "#a0a0a0" : "#64748b";
  const iconColor = forceWhite ? "white" : "#1e293b";

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${0.6 * scale}rem`, transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: iconColor }}>
        {/* Globe Circle */}
        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="4" />
        {/* Horizontal & Vertical Lines */}
        <path d="M50 22 L50 78" stroke="currentColor" strokeWidth="4" />
        <path d="M22 50 L78 50" stroke="currentColor" strokeWidth="4" />
        {/* Meridians (left and right arcs) */}
        <path d="M50 22 A 14 28 0 0 0 50 78" stroke="currentColor" strokeWidth="4" fill="none" />
        <path d="M50 22 A 14 28 0 0 1 50 78" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Slanted Ring */}
        <ellipse cx="50" cy="50" rx="46" ry="12" transform="rotate(-25 50 50)" stroke="currentColor" strokeWidth="4" fill="none" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2px' }}>
        <span style={{ fontSize: "2rem", fontWeight: 900, color: textColor, lineHeight: 0.85, fontFamily: "var(--font-heading)", letterSpacing: "0em" }}>Afrizend</span>
        <span style={{ fontSize: "0.55rem", fontWeight: 700, color: subtextColor, lineHeight: 1, letterSpacing: "0.06em", marginTop: "5px" }}>BUILDING TRUST FOR GLOBAL WORK</span>
      </div>
    </div>
  );
}
