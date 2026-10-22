import { useEffect, useRef, type RefObject } from "react";

const focusableSelector = 'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), [tabindex="0"]';

/** One focus boundary for the active sheet, with its original trigger retained across sheets. */
export function useModalFocus(key: string | null, close: () => void, fallback: RefObject<HTMLElement | null>) {
  const closeRef = useRef(close);
  const triggerRef = useRef<HTMLElement | null>(null);
  const previousKey = useRef<string | null>(null);
  closeRef.current = close;

  useEffect(() => {
    const previous = previousKey.current;
    previousKey.current = key;
    if (!key) {
      if (previous) {
        const trigger = triggerRef.current;
        (trigger?.isConnected ? trigger : fallback.current)?.focus({ preventScroll: true });
        triggerRef.current = null;
      }
      return;
    }
    if (!previous) triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = document.querySelector<HTMLElement>(`[data-modal="${key}"]`);
    if (!modal) return;
    const targets = () => [...modal.querySelectorAll<HTMLElement>(focusableSelector)].filter(el => el.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => (modal.querySelector<HTMLElement>("[data-modal-initial]") ?? targets()[0])?.focus({ preventScroll: true }));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === "Tab") {
        const controls = targets();
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) return;
        if (!modal.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [key, fallback]);
}
