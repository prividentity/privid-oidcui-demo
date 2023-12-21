import { useSearchParams, useNavigate } from "react-router-dom";

export const useNavigateWithQueryParams = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const navigateWithQueryParams = (
    routePath: string | number,
    newQueryParams = {}
  ) => {
    // Combine the current query parameters with the new ones
    const combinedQueryParams = {
      ...Object.fromEntries(searchParams),
      ...newQueryParams,
    };
    const queryString = new URLSearchParams(combinedQueryParams)
      .toString()
      ?.replace("%3F", "");
    navigate(`${routePath}?${queryString}`);
  };
  return { navigateWithQueryParams };
};
