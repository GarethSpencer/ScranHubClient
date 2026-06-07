import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <h1>Oops...</h1>
      <p>
        {isRouteErrorResponse(error)
          ? "This page could not be found."
          : "An unexpected error occurred."}
      </p>
    </>
  );
};

export default ErrorPage;
