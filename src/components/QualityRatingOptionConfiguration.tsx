import RatingOptionConfiguration from "./RatingOptionConfiguration";

interface Props {
  groupId: string;
}

const QualityRatingOptionConfiguration = ({ groupId }: Props) => {
  return (
    <RatingOptionConfiguration
      controller="QualityOption"
      groupId={groupId}
      heading="Quality Ratings"
      helperText="The quality rating options which can be applied to each of the venues in this group. The options should be ordered from 'best' to 'worst'."
    />
  );
};

export default QualityRatingOptionConfiguration;
