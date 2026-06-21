import RatingOptionConfiguration from "./RatingOptionConfiguration";

interface Props {
  groupId: string;
}

const CostRatingOptionConfiguration = ({ groupId }: Props) => {
  return (
    <RatingOptionConfiguration
      controller="CostOption"
      groupId={groupId}
      heading="Cost Ratings"
      helperText="The cost rating options which can be applied to each of the venues in this group."
      itemNamePlural="cost ratings"
    />
  );
};

export default CostRatingOptionConfiguration;
