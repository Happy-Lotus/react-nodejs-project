import { useState, useEffect } from "react";
import styles from "./BoardPage.module.scss";
import { FaSearch } from "react-icons/fa";
import CommonNav from "../../components/nav/navigation";
import { Link } from "react-router-dom";
import { readOption } from "../../utils/api";

function BoardPage() {
  const [postData, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOption, setSearchOption] = useState("title"); // 추가된 부분
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시물 상태
  // const [thumbnail, setThumbnail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가

  useEffect(() => {
    const getPosts = async () => {
      try {
        console.log("getPosts");
        const { posts, totalPage } = await readOption(
          searchOption,
          searchTerm,
          currentPage,
          postsPerPage
        );

        setPosts(posts);
        setTotalPages(totalPage); // 총 페이지 수 설정
        // const imageList = posts ? posts.map((post) => post.thumbnail) : [];
        // setThumbnail(imageList);
        setTotalPages(totalPage);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [searchOption, searchTerm, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // 검색 후 첫 페이지로 리셋
    // 검색 버튼 클릭 시 필터링
    // const results = postData.filter((post) => {
    //   if (searchOption === "title") {
    //     return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    //   } else if (searchOption === "author") {
    //     return post.writer.toLowerCase().includes(searchTerm.toLowerCase());
    //   }
    //   return false;
    // });
    // setPosts(results); // 필터링된 결과를 상태에 저장
  };
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "..."; // 최대 길이를 초과하면 잘라내고 ... 추가
    }
    return title; // 길이가 초과하지 않으면 원본 제목 반환
  };
  const truncateRegDate = (regdate) => {
    return new Date(regdate).toLocaleDateString();
  };
  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      console.log(searchTerm);
      handleSearch();
    }
  };
  // Pagination logic
  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  // const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
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
              <option value="writer">작성자</option>
            </select>
            <input
              className={styles.input__box__text}
              id="search"
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => handleSearchEnter(e)}
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
            {postData && postData.length > 0 ? (
              postData.map((post, index) => (
                <tr key={index} className={styles.tr__content}>
                  <td>{post.boardid}</td>
                  <td className={styles.title__cell}>
                    {post.thumbnail ? ( // post.thumbnail을 사용
                      <img
                        src={`http://localhost:4000/${post.thumbnail}`}
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
                    <Link to={`/posts/detail/${post.boardid}`}>
                      {truncateTitle(post.title, 30)}
                      {post.hasFile > 0 ? "🔗" : ""}{" "}
                    </Link>
                  </td>
                  <td>{post.writer}</td>
                  <td>{truncateRegDate(post.regdate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  게시물이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
