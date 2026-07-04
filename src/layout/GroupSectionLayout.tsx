import { Link, useParams } from "react-router-dom";
import SectionLayout from "./SectionLayout";
import { useGetGroup } from "../api/controllerHooks/useGroupController";

const GroupSectionLayout = () => {
  const { id = "" } = useParams();
  const { data } = useGetGroup(id);

  const groupName = data?.group?.groupName ?? "Group";
  const icon = data?.group?.icon;

  return (
    <SectionLayout
      tabsClassName="section-tabs-grid"
      title={
        <h1 className="section-title display-5">
          <Link to={`/group/${id}`} className="section-title-link">
            {icon && (
              <span className="group-card-avatar section-title-avatar flex-shrink-0">
                {icon}
              </span>
            )}
            <span className="section-title-name">{groupName}</span>
          </Link>
        </h1>
      }
      tabs={[
        { label: "Summary", to: `/group/${id}`, end: true },
        { label: "Management", to: `/group/${id}/manage`, end: true },
        { label: "Users", to: `/group/${id}/users`, end: true },
        { label: "Options", to: `/group/${id}/options` },
      ]}
    />
  );
};

export default GroupSectionLayout;
