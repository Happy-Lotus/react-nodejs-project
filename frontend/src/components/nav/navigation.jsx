import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import styles from "./navigation.module.scss";

function CommonNav({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.pagination__button} ${
            currentPage === i ? styles.active : styles.inactive
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.submit__container}>
        <Link to={`/posts/edit`}>
          <button className={styles.submit__btn}>작성하기</button>
        </Link>
      </div>
      <div className={styles.pagination}>
        {currentPage > 1 && ( // Only show the previous button if not on the first page
          <button
            className={styles.prev__page}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <MdArrowBackIos />
          </button>
        )}
        {renderPageNumbers()}
        {currentPage < totalPages && ( // Only show the next button if not on the last page
          <button
            className={styles.next__page}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <MdArrowForwardIos />
          </button>
        )}
      </div>
    </footer>
  );
}
export default CommonNav;
