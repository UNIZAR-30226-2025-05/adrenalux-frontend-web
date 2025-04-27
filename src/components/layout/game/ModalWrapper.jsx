import React from "react";

export default function ModalWrapper({ children, style = {} }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
