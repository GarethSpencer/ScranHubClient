import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import SectionTabs, { type SectionTab } from "../navigation/SectionTabs";

interface Props {
  tabs?: SectionTab[];
  title?: ReactNode;
  tabsClassName?: string;
}

const SectionLayout = ({ tabs = [], title, tabsClassName }: Props) => {
  return (
    <div className="content-wrapper">
      {title}
      <SectionTabs tabs={tabs} className={tabsClassName} />
      <div className="section-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default SectionLayout;
