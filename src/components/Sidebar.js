"use client";

import { useState } from "react";
import OptionCard from "./OptionCard";
import { config } from "@/config";

export default function Sidebar({ selectedCladding, selectedDesk, selectedSofa, onSelectCladding, onSelectDesk, onSelectSofa }) {
  // Flatten all items for animation delay calculation
  const totalCladdings = config.claddings.length;

  return (
    <aside
      style={{
        width: "320px",
        flexShrink: 0,
        height: "100vh",
        background: "#EDE5D8",
        borderRight: "1px solid #D6CCBC",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Logo + Branding */}
      <div
        style={{
          padding: "24px 24px 18px",
          borderBottom: "1px solid #D6CCBC",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <LogoImage />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "1.1rem",
            color: "#8B6B4A",
            letterSpacing: "0.06em",
          }}
        >
          Atelier
        </div>
      </div>

      {/* Scrollable option sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 0" }}>

        {/* Claddings Section */}
        <SectionTitle>Cladding Finish</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.claddings.map((item, i) => (
            <OptionCard
              key={item.id}
              id={item.id}
              label={item.label}
              thumbSrc={`/images/claddings/${item.id}/thumb.jpg`}
              isSelected={selectedCladding === item.id}
              isDisabled={false}
              onSelect={onSelectCladding}
              animDelay={i * 60}
            />
          ))}
        </div>

        {/* Desks Section */}
        <SectionTitle>EXCUTIVE DESKS</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.desks.map((item, i) => (
            <OptionCard
              key={item.id}
              id={item.id}
              label={item.label}
              thumbSrc={`/images/desks/${item.id}/thumb.jpg`}
              isSelected={selectedDesk === item.id}
              isDisabled={false}
              onSelect={onSelectDesk}
              animDelay={(totalCladdings + i) * 60}
            />
          ))}
        </div>

        {/* Sofas Section */}
        <SectionTitle>SOFAS &amp; SEATING</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
          {config.sofas.map((item, i) => (
            <OptionCard
              key={item.id}
              id={item.id}
              label={item.label}
              thumbSrc={`/images/sofas/${item.id}/thumb.jpg`}
              isSelected={selectedSofa === item.id}
              isDisabled={false}
              onSelect={onSelectSofa}
              animDelay={(totalCladdings + config.desks.length + i) * 60}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 24px 18px",
          borderTop: "1px solid #D6CCBC",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: "0.68rem",
            letterSpacing: "0.06em",
            color: "#C8B89A",
          }}
        >
          Curated for Eng. Naglaa
        </p>
      </div>
    </aside>
  );
}

function SectionTitle({ children, muted }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "1.05rem",
        letterSpacing: "0.04em",
        color: muted ? "#C8B89A" : "#8B6B4A",
        margin: "0 0 12px 2px",
      }}
    >
      {children}
    </h2>
  );
}

function LogoImage() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mobica_logo.png"
      alt="Mobica"
      style={{ height: "40px", width: "auto", objectFit: "contain", display: "block" }}
      onError={() => setShow(false)}
    />
  );
}
