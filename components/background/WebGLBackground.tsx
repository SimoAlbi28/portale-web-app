"use client";

import dynamic from "next/dynamic";

const WebGLScene = dynamic(
  () => import("./WebGLScene").then((m) => m.WebGLScene),
  { ssr: false }
);

export function WebGLBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ contain: "strict" }}
    >
      <WebGLScene />
    </div>
  );
}
