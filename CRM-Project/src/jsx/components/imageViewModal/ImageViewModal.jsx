import React from "react";
import styles from "./imageViewModal.module.css";

const ImageViewModal = ({ imageSrc, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
        <span className={styles.closeBtn} onClick={onClose}>
          <i class="fa-solid fa-xmark fs-2"></i>
        </span>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // prevent close on inner click
      >
        
        <img src={imageSrc} alt="Preview" className={styles.image} />
      </div>
    </div>
  );
};

export default ImageViewModal;
