import React from 'react';
import styles from './styles.module.css';

const SIGNAL_WORDS = {
  danger: 'DANGER',
  warning: 'WARNING',
  caution: 'CAUTION',
  notice: 'NOTICE',
};

// Per ANSI Z535.4 / Z535.6, NOTICE is reserved for property-damage /
// non-personal-injury messages and is the one signal word that never
// carries the safety alert symbol — the symbol specifically flags a
// personal injury hazard.
const SHOW_SYMBOL_BY_DEFAULT = {
  danger: true,
  warning: true,
  caution: true,
  notice: false,
};

/**
 * Safety alert symbol: a solid equilateral triangle enclosing an
 * exclamation mark. Inside a signal word panel the triangle takes the
 * signal word's color (white on DANGER, black on WARNING/CAUTION) and the
 * exclamation mark takes the panel's background color, so it reads as a
 * cut-out — matching the symbol as drawn in Z535.4 / Z535.6.
 */
function SafetyAlertSymbol({className}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 21"
      aria-hidden="true"
      focusable="false">
      <path
        d="M12 0.8 L23.4 20.4 H0.6 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        className={styles.symbolMark}
        d="M10.6 6.6 H13.4 L12.9 14.2 H11.1 Z"
      />
      <circle className={styles.symbolMark} cx="12" cy="16.9" r="1.45" />
    </svg>
  );
}

export default function SafetyAlert({
  type,
  title,
  icon = true,
  className,
  children,
}) {
  const key = typeof type === 'string' ? type.toLowerCase() : type;
  const signalWord = SIGNAL_WORDS[key];

  if (!signalWord) {
    // Fail loudly: a mistyped signal word is a safety-content bug, and
    // throwing here fails the static build instead of shipping a page
    // with a missing or wrong-colored warning.
    throw new Error(
      `SafetyAlert: unknown type "${type}". Expected one of: ` +
        `${Object.keys(SIGNAL_WORDS).join(', ')}.`,
    );
  }

  const displayWord = title ?? signalWord;
  const showSymbol = icon !== false && SHOW_SYMBOL_BY_DEFAULT[key];

  return (
    <aside
      className={[
        'z535-alert',
        `z535-alert--${key}`,
        styles.alert,
        styles[key],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="note"
      aria-label={`${signalWord} safety message`}>
      <div className={`z535-alert__signal ${styles.signalPanel}`}>
        {showSymbol && <SafetyAlertSymbol className={styles.symbol} />}
        <span className={styles.signalWord}>{displayWord}</span>
      </div>
      <div className={`z535-alert__message ${styles.messagePanel}`}>
        {children}
      </div>
    </aside>
  );
}

// Optional semantic wrappers for the three-part message structure Z535.6
// recommends: the nature of the hazard, the consequence of ignoring it,
// and how to avoid it. Purely organizational — plain children work fine
// too if you don't want the structure spelled out.
//
// Rendered as <div>, not <p>: MDX wraps multi-line children in <p>, and a
// <p> inside a <p> is invalid HTML that causes React hydration errors.
// The lead-in label is real text (not CSS ::before content) so it is
// reliably read by screen readers and can be translated via `label`.
function MessagePart({part, defaultLabel, label, children}) {
  return (
    <div className={`z535-${part} ${styles.part}`}>
      {label !== false && (
        <strong className={styles.partLabel}>{label ?? defaultLabel} </strong>
      )}
      {children}
    </div>
  );
}

export function Hazard({label, children}) {
  return (
    <MessagePart part="hazard" defaultLabel="Hazard:" label={label}>
      {children}
    </MessagePart>
  );
}

export function Consequence({label, children}) {
  return (
    <MessagePart part="consequence" defaultLabel="Consequence:" label={label}>
      {children}
    </MessagePart>
  );
}

export function Avoidance({label, children}) {
  return (
    <MessagePart part="avoidance" defaultLabel="To avoid:" label={label}>
      {children}
    </MessagePart>
  );
}
