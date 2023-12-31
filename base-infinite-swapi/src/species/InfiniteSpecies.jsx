import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "react-query";
const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, fetchNextPage, hasNextPage, isLoading, isError, isFetching } =
    useInfiniteQuery(
      "species",
      ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
      }
    );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">error...</div>;
 
  console.log(data);
  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
    {(isFetching)&& (<div className="loading">Loading...</div>)}
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) =>
        pageData.results.map((data) => (
          <Species
          key={data.name}
            name={data.name}
            language={data.language}
            averageLifespan={data.average_lifespan}
          />
        ))
      )}
    </InfiniteScroll>
    </>
  );
}
