import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import Person from "./Person";
import { useEffect } from "react";
const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query

  const { isSuccess, data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery(
      "sw-people",
      ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
      }
    );

  useEffect(() => {
    let fetching = false;
    const handleScroll = async (e) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">error...</div>;
  console.log(data);
  return (
    <div>
      {isSuccess &&
        data.pages.map((pageData) => 
          pageData.results.map((person) => 
            (
              <div key={person.name} className="rrrr">
                {person.name}
                <ul>
                  <li>hair: {person.hair_color}</li>
                  <li>eyes: {person.eye_color}</li>
                </ul>
              </div>
            )
          )
        )}
    </div>
  );
}
