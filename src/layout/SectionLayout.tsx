import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import SectionTabs, { type SectionTab } from "../navigation/SectionTabs";

interface Props {
  tabs?: SectionTab[];
  title?: ReactNode;
}

const SectionLayout = ({ tabs = [], title }: Props) => {
  return (
    <div className="content-wrapper">
      {title && <h1 className="section-title">{title}</h1>}
      <SectionTabs tabs={tabs} />
      <div className="section-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default SectionLayout;
