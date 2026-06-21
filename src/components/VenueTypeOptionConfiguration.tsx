import TypeOptionConfiguration from "./TypeOptionConfiguration";

interface Props {
  groupId: string;
}

const VenueTypeOptionConfiguration = ({ groupId }: Props) => {
  return (
    <TypeOptionConfiguration
      controller="VenueTypeOption"
      groupId={groupId}
      heading="Venue Types"
      helperText="The venue type options which can be applied to each of the venues in this group."
    />
  );
};

export default VenueTypeOptionConfiguration;
