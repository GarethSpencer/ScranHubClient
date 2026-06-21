import { useParams } from "react-router-dom";
import FoodTypeOptionConfiguration from "../../components/FoodTypeOptionConfiguration";

const GroupOptionsPage = () => {
  const { id = "" } = useParams();

  return <FoodTypeOptionConfiguration groupId={id} />;
};

export default GroupOptionsPage;
