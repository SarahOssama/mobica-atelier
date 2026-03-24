"use client";

import { useState, useEffect, useRef } from "react";
import { config } from "@/config";

export default function PreviewPanel({ selectedCladding, selectedDesk }) {
  const claddingLabel = config.claddings.find((c) => c.id === selectedCladding)?.label ?? "";
  const deskLabel     = config.desks.find((d) => d.id === selectedDesk)?.label ?? "";
  const caption       = [claddingLabel, deskLabel].filter(Boolean).join(" · ");

  const [deskX, setDeskX] = useState(0);
  const [deskY, setDeskY] = useState(0);

  // Reset desk position when desk selection changes
  useEffect(() => {
    setDeskX(0);
    setDeskY(0);
  }, [selectedDesk]);

  const claddingSrc = selectedCladding
    ? `/images/claddings/${selectedCladding}/preview.jpg`
    : null;

  const deskSrc = selectedDesk
    ? `/images/desks/${selectedDesk}/preview.png`
    : null;

  const showDesk = claddingSrc && deskSrc;

  return (
    <main
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F0E8",
        position: "relative",
        overflow: "hidden",
        padding: "40px",
      }}
    >
      {/* Framed presentation board */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "82%",
          maxHeight: "88%",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Outer frame — matte border + shadow */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            minHeight: 0,
            background: "#FFFFFF",
            borderRadius: "3px",
            padding: "14px",
            boxShadow:
              "0 2px 8px rgba(44,34,24,0.08), 0 8px 32px rgba(44,34,24,0.10), 0 0 0 1px rgba(44,34,24,0.04)",
          }}
        >
          {/* Inner canvas */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "2px",
              background: "#EAE3D8",
            }}
          >
            {/* Cladding base layer */}
            {claddingSrc ? (
              <ImageLayer
                src={claddingSrc}
                alt={claddingLabel}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "1.2rem",
                    color: "#C8B89A",
                    letterSpacing: "0.05em",
                  }}
                >
                  Select a finish to begin
                </p>
              </div>
            )}

            {/* Desk overlay — transparent PNG draped over the cladding */}
            {showDesk && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={deskSrc}
                alt={deskLabel}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `translate(${deskX}%, ${deskY}%)`,
                  transition: "transform 0.1s ease",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            )}

            {/* Positioning controls — shown when desk is overlaid */}
            {showDesk && (
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "6px",
                  padding: "10px 22px",
                  display: "flex",
                  gap: "18px",
                  alignItems: "center",
                  boxShadow:
                    "0 2px 12px rgba(44,34,24,0.12), 0 0 0 1px rgba(44,34,24,0.06)",
                  zIndex: 10,
                  whiteSpace: "nowrap",
                }}
              >
                <SliderControl
                  label="← →"
                  value={deskX}
                  onChange={setDeskX}
                />
                <div
                  style={{
                    width: "1px",
                    height: "28px",
                    background: "rgba(44,34,24,0.12)",
                    flexShrink: 0,
                  }}
                />
                <SliderControl
                  label="↑ ↓"
                  value={deskY}
                  onChange={setDeskY}
                />
              </div>
            )}

            {/* Prompt when only cladding is selected */}
            {claddingSrc && !deskSrc && (
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#8B6B4A",
                    whiteSpace: "nowrap",
                  }}
                >
                  Select a desk to overlay
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Caption plaque */}
        <div
          style={{
            marginTop: "16px",
            padding: "8px 24px",
            background: "#FFFFFF",
            borderRadius: "2px",
            boxShadow: "0 1px 4px rgba(44,34,24,0.06), 0 0 0 1px rgba(44,34,24,0.03)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              color: caption ? "#8B6B4A" : "#C8B89A",
              minHeight: "1.2em",
            }}
          >
            {caption || "—"}
          </p>
          {caption && (
            <p
              style={{
                margin: "3px 0 0",
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C8B89A",
              }}
            >
              Interior Composition
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

// ── SliderControl ───────────────────────────────────────────────────────────

function SliderControl({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "#8B6B4A",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min="-30"
        max="30"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "110px",
          accentColor: "#8B6B4A",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ── ImageLayer ─────────────────────────────────────────────────────────────
// Crossfades between images: the previous stays visible while the next
// preloads, then both transition simultaneously (old → 0, new → 1).

function ImageLayer({ src, alt, style }) {
  const [back, setBack] = useState(null);
  const [front, setFront] = useState(null);
  const [frontVisible, setFrontVisible] = useState(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setBack(null);
      setFront(null);
      setFrontVisible(false);
      return;
    }

    if (src === front) return;

    pendingRef.current = src;

    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      if (pendingRef.current !== src) return; // stale load
      setBack(front);
      setFront(src);
      setFrontVisible(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFrontVisible(true));
      });
    };

    return () => { img.onload = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const TRANSITION = "opacity 500ms ease";

  return (
    <>
      {back && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={back}
          alt=""
          style={{
            ...style,
            opacity: frontVisible ? 0 : 1,
            transition: TRANSITION,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}
      {front && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={front}
          alt={alt ?? ""}
          style={{
            ...style,
            opacity: frontVisible ? 1 : 0,
            transition: frontVisible ? TRANSITION : "none",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}
    </>
  );
}
