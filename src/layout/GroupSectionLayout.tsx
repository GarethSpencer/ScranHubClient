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
        <h1 className="section-title display-5">
          <Link to={`/group/${id}`}>{groupName}</Link>
        </h1>
      }
      tabs={[
        { label: "Summary", to: `/group/${id}`, end: true },
        { label: "Management", to: `/group/${id}/manage`, end: true },
        { label: "Users", to: `/group/${id}/users`, end: true },
        { label: "Food Types", to: `/group/${id}/foodtypes` },
        { label: "Venue Types", to: `/group/${id}/venuetypes` },
        { label: "Quality Ratings", to: `/group/${id}/qualityratings` },
        { label: "Cost Ratings", to: `/group/${id}/costratings` },
      ]}
    />
  );
};

export default GroupSectionLayout;
