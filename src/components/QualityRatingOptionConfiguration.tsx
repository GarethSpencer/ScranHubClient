import OptionConfiguration from "./OptionConfiguration";

interface Props {
  groupId: string;
}

const QualityRatingOptionConfiguration = ({ groupId }: Props) => {
  return (
    <OptionConfiguration
      controller="QualityOption"
      groupId={groupId}
      heading="Quality Ratings"
      helperText="The quality rating options which can be applied to each of the venues in this group. The options should be ordered from 'best' to 'worst'."
    />
  );
};

export default QualityRatingOptionConfiguration;
