import React from "react";

/** Button wrapper */
export default function BaseButton({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return <button {...props}>{children}</button>;
}
