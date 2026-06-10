import "./../pages/Layout/Layout.css";

const LoginLayoutFooter = () => {
  const copyrightYear = new Date().getFullYear();
  const magnificLink = "https://www.magnific.com";
  const frontendLink = "https://github.com/garethspencer/ScranHubClient";
  const backendLink = "https://github.com/garethspencer/ScranHub";

  return (
    <div className="content-footer">
      <a href={magnificLink} className="d-block">
        Background image designed by Freepik - Magnific.com
      </a>
      <p className="d-block mt-2">
        © {copyrightYear} Gareth Spencer. Check out my{" "}
        <a href={frontendLink}>frontend</a> and{" "}
        <a href={backendLink}>backend</a> source code on GitHub.
      </p>
    </div>
  );
};

export default LoginLayoutFooter;
