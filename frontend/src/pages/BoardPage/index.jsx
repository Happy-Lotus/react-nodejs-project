import { useState, useEffect } from "react";
import styles from "./BoardPage.module.scss";
import { FaSearch } from "react-icons/fa";
import CommonNav from "../../components/nav/navigation";
import { fetchPosts } from "../../utils/api";
import { Link } from "react-router-dom";

function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOption, setSearchOption] = useState("title"); // 추가된 부분
  const [image, setImage] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log(data);
        setPosts(data);

        const imageList = data.map((post) => post.thumbnail);
        setImage(imageList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.page}>
      {/**공통 네비게이션 UI 부분 */}
      {/**공통 헤더 UI 부분 */}

      <div className={styles.page__contents}>
        <div className={styles.page__contents__introBox}>
          <span className={styles.wrapper__title}>목록</span>
        </div>
        {/**검색창 UI 부분 */}
        <div className={styles.searchbar}>
          <div className={styles.right__search}>
            <div className={styles.input__group}>
              <select
                className={styles.toggle__box}
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="author">작성자</option>
              </select>
              <input
                className={styles.input__box__text}
                type="text"
                placeholder="검색"
              />
              <span className={styles.input__box__img}>
                <FaSearch />
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
              {posts.map((post, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td className={styles.title__cell}>
                    <img
                      src={`http://localhost:4000/${image[0]}`}
                      alt={`Thumbnail ${post.thumbnail}`}
                      className={styles.thumbnail}
                    />
                    <Link to={`/posts/detail/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.writer}</td>
                  <td>{post.regdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CommonNav />
    </div>
  );
}

export default BoardPage;
