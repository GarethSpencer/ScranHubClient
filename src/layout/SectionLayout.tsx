import { Outlet } from "react-router-dom";
import SectionTabs, { type SectionTab } from "../navigation/SectionTabs";

interface Props {
  tabs?: SectionTab[];
}

const SectionLayout = ({ tabs = [] }: Props) => {
  return (
    <div className="content-wrapper">
      <SectionTabs tabs={tabs} />
      <Outlet />
    </div>
  );
};

export default SectionLayout;
