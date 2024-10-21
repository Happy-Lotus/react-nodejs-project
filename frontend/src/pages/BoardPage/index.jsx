import { useState, useEffect } from "react";
import styles from "./BoardPage.module.scss";
import { FaSearch } from "react-icons/fa";
import CommonNav from "../../components/nav/navigation";
import { fetchPosts } from "../../utils/api";
import { Link } from "react-router-dom";

import { BsLink45Deg } from "react-icons/bs";
import { toast } from "react-toastify";

function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOption, setSearchOption] = useState("title"); // 추가된 부분
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물 상태
  const [thumbnail, setThumbnail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log(data);
        setPosts(data);

        const imageList = data.map((post) => post.thumbnail);
        setThumbnail(imageList);
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
    setCurrentPage(1); // 검색 후 첫 페이지로 리셋
  };
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "..."; // 최대 길이를 초과하면 잘라내고 ... 추가
    }
    return title; // 길이가 초과하지 않으면 원본 제목 반환
  };
  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
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
              {currentPosts.map((post, index) => (
                <tr key={index} className={styles.tr__content}>
                  <td>{filteredPosts.length - (indexOfFirstPost + index)}</td>
                  <td className={styles.title__cell}>
                    {thumbnail[index] ? (
                      <img
                        src={`http://localhost:4000/${thumbnail[index]}`}
                        alt={`Thumbnail ${post.thumbnail}`}
                        className={styles.thumbnail}
                      />
                    ) : (
                      <div
                        className={styles.placeholder}
                        style={{
                          backgroundColor: "transparent",
                          width: "240px",
                          height: "160px",
                        }}
                      ></div>
                    )}
                  </td>
                  <td className={styles.content__cell}>
                    <Link to={`/posts/detail/${post.id}`}>
                      {truncateTitle(post.title, 30)}
                      {post.files && post.files.length > 0 ? "🔗" : ""}{" "}
                      {/* 첨부파일이 있으면 🔗 표시 */}
                    </Link>
                  </td>
                  <td>{post.writer}</td>
                  <td>{post.regdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CommonNav
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default BoardPage;
