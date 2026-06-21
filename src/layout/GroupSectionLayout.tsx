import { useParams } from "react-router-dom";
import SectionLayout from "./SectionLayout";
import { useGetGroup } from "../api/controllerHooks/useGroupController";

const GroupSectionLayout = () => {
  const { id = "" } = useParams();
  const { data } = useGetGroup(id);

  const groupName = data?.group?.groupName ?? "Group";

  return (
    <SectionLayout
      title={groupName}
      tabs={[{ label: "Overview", to: `/group/${id}`, end: true }]}
    />
  );
};

export default GroupSectionLayout;
