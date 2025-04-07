import { ReactNode } from "react";

interface Props {
  id: string;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
  backdrop?: string;
  keyboard?: string;
  close?: boolean;
}

const Modal = ({
  id,
  title,
  body,
  footer,
  backdrop = "true",
  keyboard = "true",
  close = true,
}: Props) => {
  return (
    <div>
      <div
        className="modal fade"
        id={id}
        tabIndex={-1}
        aria-labelledby="modalLabel"
        aria-hidden="true"
        data-bs-backdrop={backdrop}
        data-bs-keyboard={keyboard}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalLabel">
                {title}
              </h1>
              {close && (
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              )}
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
