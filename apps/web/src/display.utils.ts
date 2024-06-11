/** Utility for building a classname string */
export const cns = (...classnames: (string | boolean | undefined)[]) =>
  classnames.filter(Boolean).join(" ");

const colors = ["coral", "bisque", "lightskyblue", "slateblue"];
const __c_cache: Record<string, string> = {};
const rnd = () => colors[Math.floor(Math.random() * colors.length)];
export const color = (id: string) => __c_cache[id] ?? (__c_cache[id] = rnd());
