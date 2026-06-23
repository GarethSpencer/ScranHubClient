import { Link, useParams } from "react-router-dom";
import SectionLayout from "./SectionLayout";
import { useGetGroup } from "../api/controllerHooks/useGroupController";

const GroupSectionLayout = () => {
  const { id = "" } = useParams();
  const { data } = useGetGroup(id);

  const groupName = data?.group?.groupName ?? "Group";

  return (
    <SectionLayout
      tabsClassName="section-tabs-grid"
      title={
        <Link to={`/group/${id}`} className="section-title display-5">
          {groupName}
        </Link>
      }
      tabs={[
        { label: "Management", to: `/group/${id}`, end: true },
        { label: "Summary", to: `/group/${id}/details`, end: true },
        { label: "Users", to: `/group/${id}/users`, end: true },
        { label: "Food Types", to: `/group/${id}/foodtypes` },
        { label: "Venue Types", to: `/group/${id}/venuetypes` },
        { label: "Quality Rank", to: `/group/${id}/qualityratings` },
        { label: "Cost Rank", to: `/group/${id}/costratings` },
      ]}
    />
  );
};

export default GroupSectionLayout;
