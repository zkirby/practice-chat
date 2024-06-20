import { createPortal } from "react-dom";

import "./modal.css";

export default function Modal({
  open,
  children,
}: React.PropsWithChildren<{ open: boolean }>) {
  return createPortal(
    <div className="modal-wrapper" data-open={open}>
      <div className="modal">{children}</div>
      <div className="overlay"></div>
    </div>,
    document.body
  );
}
