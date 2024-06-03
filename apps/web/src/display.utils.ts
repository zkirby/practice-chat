/** Utility for building a classname string */
export const cns = (...classnames: (string | boolean | undefined)[]) =>
  classnames.filter(Boolean).join(" ");
