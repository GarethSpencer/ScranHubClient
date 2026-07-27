import { Link, useParams } from "react-router-dom";
import SectionLayout from "./SectionLayout";
import {
  useGetGroup,
  useGetUserGroups,
} from "../api/controllerHooks/useGroupController";
import useRatingCelebration from "../contexts/ratingCelebration/useRatingCelebration";

const GroupSectionLayout = () => {
  const { id = "" } = useParams();

  const { consumeRecentSave } = useRatingCelebration();

  const { data } = useGetGroup(id);

  const { data: userGroups } = useGetUserGroups();
  const venuesToRate =
    userGroups?.userGroups?.find((group) => group.groupId === id)
      ?.venuesToRate ?? 0;

  const groupName = data?.group?.groupName ?? "Group";
  const icon = data?.group?.icon;

  return (
    <SectionLayout
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
        { label: "Venue Summary", to: `/group/${id}`, end: true },
        {
          label: "Create & Rate",
          to: `/group/${id}/manage`,
          end: true,
          badgeCount: venuesToRate,
          badgeLabel: "venues to rate",
          shouldCelebrateAtZero: consumeRecentSave,
        },
        { label: "Manage Options", to: `/group/${id}/options` },
        { label: "Group Members", to: `/group/${id}/users`, end: true },
      ]}
    />
  );
};

export default GroupSectionLayout;
