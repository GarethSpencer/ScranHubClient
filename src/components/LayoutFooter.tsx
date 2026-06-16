import "./../layout/Layout.scss";

const LayoutFooter = () => {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className="content-footer">
      <p>© {copyrightYear} Gareth Spencer. Happy Scranning!</p>
    </div>
  );
};

export default LayoutFooter;
