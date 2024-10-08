import CommonHeader from "../../components/header/header";
import styles from "./BoardPage.module.scss";

function BoardPage() {
  const data = [
    {
      no: 20,
      thumbnail: "frontend/src/assets/알고리즘.jpg",
      title:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      author: "annie",
      date: "2024-09-03",
    },
    {
      no: 19,
      thumbnail: "frontend/src/assets/알고리즘.jpg",
      title:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      author: "annie",
      date: "2024-09-03",
    },
    {
      no: 18,
      thumbnail: "frontend/src/assets/알고리즘.jpg",
      title:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      author: "annie",
      date: "2024-09-03",
    },
    {
      no: 17,
      thumbnail: "frontend/src/assets/알고리즘.jpg",
      title:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      author: "annie",
      date: "2024-09-03",
    },
    {
      no: 16,
      thumbnail: "frontend/src/assets/알고리즘.jpg",
      title:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      author: "annie",
      date: "2024-09-03",
    },

    // Add more rows as needed
  ];
  return (
    <div className={styles.page}>
      {/**공통 네비게이션 UI 부분 */}
      {/**공통 헤더 UI 부분 */}
      <CommonHeader />
      <div className={styles.page__contents}>
        <div className={styles.page__contents__introBox}>
          <span className={styles.wrapper__title}>목록</span>
        </div>
        {/**검색창 UI 부분 */}
        <div className={styles.searchbar}>
          <div className={styles.right__search}>
            <div className={styles.input__group}>
              <input
                className={styles.input__box__text}
                type="text"
                placeholder="검색"
              />
              <span className={styles.input__box__img}>
                <img src="" className={styles.input__box__img__style} />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.table__container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성시간</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.no}</td>
                  <td className={styles.title__cell}>
                    <img
                      src="frontend/src/assets/알고리즘.jpg"
                      alt={`Thumbnail ${row.no}`}
                      className={styles.thumbnail}
                    />
                    {row.title}
                  </td>
                  <td>{row.author}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.footer}>
            <div className={styles.pagination}>
              <button className={styles.prev__page}>1</button>
              <button className={styles.next__page}>2</button>
            </div>
            <div className={styles.submit__container}>
              <button className={styles.submit__btn}>작성하기</button>
            </div>
          </div>
        </div>
      </div>
      {/**공통 footer ui 부분 */}
    </div>
  );
}

export default BoardPage;
