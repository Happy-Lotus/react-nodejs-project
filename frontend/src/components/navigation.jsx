import { Link } from "react-router-dom";

import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import styles from "./styles/navigation.module.scss";

function CommonNav({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = []; //페이지 배열 생성
    for (let i = 1; i <= totalPages; i++) {
      //각 페이지 번호에 대한 button 생성
      pageNumbers.push(
        <button
          key={i} //고유 식별
          className={`${styles.pagination__button} ${
            currentPage === i ? styles.active : styles.inactive
          }`} //현재 페이지 currentPage와 비교. 활성화된 페이지는 active, 비활성화된 페이지는 inactive 클래스 적용
          onClick={() => handlePageChange(i)} //버튼 클릭 시 handlePageChange(i) 호출해 해당 페이지로 이동
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.submit__container}>
        <Link to={`/posts/edit`}>
          <button className={styles.submit__btn}>작성하기</button>
        </Link>
      </div>
      <div className={styles.pagination}>
        {currentPage > 1 && ( // 현재 페이지가 1보다 클 경우에만 이전 페이지 버튼 표시
          <button
            className={styles.prev__page}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <MdArrowBackIos />
          </button>
        )}
        {renderPageNumbers()} {/**페이지 번호 버튼들 렌더링 */}
        {currentPage < totalPages && ( // 현재 페이지가 총 페이지 수보다 작을 경우에만 다음 페이지 버튼 표시
          <button
            className={styles.next__page}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <MdArrowForwardIos />
          </button>
        )}
      </div>
    </nav>
  );
}
export default CommonNav;
