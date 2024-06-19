/** Get a random element from an array */
export const random = <T>(arr: T[]) =>
  arr[Math.round(Math.random() * arr.length)];
