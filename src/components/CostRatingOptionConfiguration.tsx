import OptionConfiguration from "./OptionConfiguration";

interface Props {
  groupId: string;
}

const CostRatingOptionConfiguration = ({ groupId }: Props) => {
  return (
    <OptionConfiguration
      controller="CostOption"
      groupId={groupId}
      heading="Cost Ranks"
      helperText="The cost rating options which can be applied to rank each of the venues in this group. The options should be ordered from 'best' to 'worst'."
    />
  );
};

export default CostRatingOptionConfiguration;
