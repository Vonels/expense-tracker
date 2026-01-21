import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
}

const Modal = ({ onClose }: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button className={css.closeBtnCategoriesModal}>
          <svg width="12" height="12">
            <use href="/path-to-your-icons.svg#icon-check"></use>
          </svg>
        </button>

        <h2 className={css.titleCategoriesModal}>Expenses</h2>
        <p className={css.allCategoryTxt}>All Category</p>

        <ul className={css.listCategoriesModal}>
          <li className={`${css.itemCategory} ${css.chosenCategoryBg}`}>
            <span>Cinema</span>
            <div className={css.actionBtns}>
              <button className={css.iconBtnCheck}>
                <svg width="12" height="12">
                  <use href="/path-to-your-icons.svg#icon-check"></use>
                </svg>
              </button>
              <button className={css.iconBtnEdit}>
                <svg width="12" height="12">
                  <use href="/path-to-your-icons.svg#icon-check"></use>
                </svg>
              </button>
              <button className={css.iconBtnDelete}>
                <svg width="12" height="12">
                  <use href="/path-to-your-icons.svg#icon-check"></use>
                </svg>
              </button>
            </div>
          </li>

          <li className={css.itemCategory}>
            <span>Products</span>
          </li>

          <li className={css.itemCategory}>
            <span>Clothes</span>
          </li>
          <li className={css.itemCategory}>
            <span>Education</span>
          </li>
        </ul>

        <div className={css.footerModal}>
          <p className={css.newCategoryTxt}>New Category</p>
          <div className={css.inputWrapper}>
            <input
              className={css.inputCategoriesModal}
              placeholder="Enter the text"
            />
            <button className={css.btnCategoriesModal}>Add</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
