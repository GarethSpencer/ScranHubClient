import TypeOptionConfiguration from "./TypeOptionConfiguration";

interface Props {
  groupId: string;
}

const FoodTypeOptionConfiguration = ({ groupId }: Props) => {
  return (
    <TypeOptionConfiguration
      controller="FoodTypeOption"
      groupId={groupId}
      heading="Food Types"
      helperText="The food type options which can be applied to each of the venues in this group."
    />
  );
};

export default FoodTypeOptionConfiguration;
