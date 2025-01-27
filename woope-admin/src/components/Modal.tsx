import { ReactNode } from "react";

interface Props {
  id: string;
  title?: string;
  body?: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ id, title, body, footer }: Props) => {
  return (
    <div>
      <div
        className="modal fade"
        id={id}
        tabIndex={-1}
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalLabel">
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
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
