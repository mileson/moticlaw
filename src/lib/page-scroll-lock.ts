"use client";

import { useEffect } from "react";

type StyleSnapshot = {
  htmlOverflow: string;
  htmlScrollbarGutter: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
};

let lockDepth = 0;
let scrollY = 0;
let snapshot: StyleSnapshot | null = null;

export function lockPageScroll() {
  if (typeof window === "undefined") return () => {};

  lockDepth += 1;
  if (lockDepth === 1) {
    const root = document.documentElement;
    const body = document.body;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const currentPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    scrollY = window.scrollY || root.scrollTop || body.scrollTop || 0;
    snapshot = {
      htmlOverflow: root.style.overflow,
      htmlScrollbarGutter: root.style.scrollbarGutter,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    root.classList.add("page-scroll-locked");
    body.classList.add("page-scroll-locked");
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    unlockPageScroll();
  };
}

export function unlockPageScroll() {
  if (typeof window === "undefined" || lockDepth === 0) return;

  lockDepth -= 1;
  if (lockDepth > 0) return;

  const root = document.documentElement;
  const body = document.body;
  const restore = snapshot;
  snapshot = null;

  root.classList.remove("page-scroll-locked");
  body.classList.remove("page-scroll-locked");

  if (restore) {
    root.style.overflow = restore.htmlOverflow;
    root.style.scrollbarGutter = restore.htmlScrollbarGutter;
    body.style.position = restore.bodyPosition;
    body.style.top = restore.bodyTop;
    body.style.left = restore.bodyLeft;
    body.style.right = restore.bodyRight;
    body.style.width = restore.bodyWidth;
    body.style.overflow = restore.bodyOverflow;
    body.style.paddingRight = restore.bodyPaddingRight;
  }

  window.scrollTo(0, scrollY);
  scrollY = 0;
}

export function usePageScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    return lockPageScroll();
  }, [active]);
}
