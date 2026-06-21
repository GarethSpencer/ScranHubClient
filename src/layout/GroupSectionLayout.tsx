import { Link, useParams } from "react-router-dom";
import SectionLayout from "./SectionLayout";
import { useGetGroup } from "../api/controllerHooks/useGroupController";

const GroupSectionLayout = () => {
  const { id = "" } = useParams();
  const { data } = useGetGroup(id);

  const groupName = data?.group?.groupName ?? "Group";

  return (
    <SectionLayout
      title={
        <Link to={`/group/${id}`} className="section-title h1">
          {groupName}
        </Link>
      }
      tabs={[
        { label: "Overview", to: `/group/${id}`, end: true },
        { label: "Food Types", to: `/group/${id}/foodtypes` },
        { label: "Venue Types", to: `/group/${id}/venuetypes` },
        { label: "Cost Ratings", to: `/group/${id}/costratings` },
      ]}
    />
  );
};

export default GroupSectionLayout;
