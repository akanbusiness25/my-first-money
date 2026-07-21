"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { BucketKey } from "@/domain/money";

interface JarVisualProps {
  bucket: BucketKey;
  fillBasisPoints: number;
  focused?: boolean;
  interactive?: boolean;
  label: string;
  onActivate?: () => void;
  onShake?: () => void;
}

const jarAssets: Record<BucketKey, string> = {
  spend: "/jars/spend.png",
  save: "/jars/save.png",
  give: "/jars/give.png",
  grow: "/jars/grow.png",
};

export function JarVisual({
  bucket,
  fillBasisPoints,
  focused = false,
  interactive = false,
  label,
  onActivate,
  onShake,
}: JarVisualProps) {
  const drag = useRef({
    active: false,
    startX: 0,
    minX: 0,
    maxX: 0,
    shook: false,
  });
  const [dragOffset, setDragOffset] = useState(0);
  const fillPercent = Math.min(Math.max(fillBasisPoints, 0), 10_000) / 100;

  const visual = (
    <>
      <span className="jar-visual__stage" aria-hidden="true">
        <span
          className="jar-visual__fill"
          style={{ height: `${fillPercent}%` }}
        />
        <Image
          className="jar-visual__art"
          src={jarAssets[bucket]}
          width={1024}
          height={1536}
          alt=""
          draggable={false}
          priority={focused}
        />
      </span>
      <span
        className="sr-only"
        role="progressbar"
        aria-label={`${label} fill`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fillPercent}
      >
        {fillPercent}%
      </span>
    </>
  );

  if (!interactive) {
    return (
      <div
        className={`jar-visual jar-visual--${bucket}${focused ? " jar-visual--focused" : ""}`}
      >
        {visual}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`jar-visual jar-visual--button jar-visual--${bucket}${focused ? " jar-visual--focused" : ""}`}
      aria-label={label}
      style={
        focused
          ? {
              transform: `translateX(${dragOffset}px) rotate(${dragOffset / 8}deg)`,
            }
          : undefined
      }
      onClick={() => {
        if (!drag.current.shook) onActivate?.();
        drag.current.shook = false;
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onShake?.();
        onActivate?.();
      }}
      onPointerDown={(event) => {
        drag.current = {
          active: true,
          startX: event.clientX,
          minX: event.clientX,
          maxX: event.clientX,
          shook: false,
        };
        setDragOffset(0);
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current.active) return;
        setDragOffset(
          Math.max(-36, Math.min(36, event.clientX - drag.current.startX)),
        );
        drag.current.minX = Math.min(drag.current.minX, event.clientX);
        drag.current.maxX = Math.max(drag.current.maxX, event.clientX);
        if (
          !drag.current.shook &&
          drag.current.maxX - drag.current.minX >= 32
        ) {
          drag.current.shook = true;
          onShake?.();
        }
      }}
      onPointerUp={(event) => {
        drag.current.active = false;
        setDragOffset(0);
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        setDragOffset(0);
      }}
    >
      {visual}
    </button>
  );
}
