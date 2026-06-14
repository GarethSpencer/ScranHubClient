import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <div className="main-layout-container">
        <div className="login-content-wrapper mx-2 text-center">
          <p className="content-logo">🍜</p>
          <h1 className="mb-3">Oh dear</h1>
          <p>
            {isRouteErrorResponse(error)
              ? "This page could not be found"
              : "An unexpected error occurred"}
          </p>
          <a href="/">Go Home</a>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
