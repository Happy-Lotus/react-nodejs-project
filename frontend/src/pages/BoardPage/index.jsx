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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물 상태
  const [image, setImage] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log(data);
        setPosts(data);

        const imageList = data.map((post) => post.thumbnail);
        setImage(imageList);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const handleSearch = () => {
    // 검색 버튼 클릭 시 필터링
    const results = posts.filter((post) => {
      if (searchOption === "title") {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchOption === "author") {
        return post.writer.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredPosts(results); // 필터링된 결과를 상태에 저장
  };

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
                id="search"
                type="text"
                placeholder="검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className={styles.input__box__img} onClick={handleSearch}>
                <FaSearch />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.table__container}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.index__cell}>
                <th>No.</th>
                <th className={styles.thumbnail__th}></th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성시간</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, index) => (
                <tr key={index} className={styles.tr__content}>
                  <td>{index}</td>
                  <td className={styles.title__cell}>
                    <img
                      src={`http://localhost:4000/${image[0]}`}
                      alt={`Thumbnail ${post.thumbnail}`}
                      className={styles.thumbnail}
                    />
                  </td>
                  <td className={styles.content__cell}>
                    {" "}
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
