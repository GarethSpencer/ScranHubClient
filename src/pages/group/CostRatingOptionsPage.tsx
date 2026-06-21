import { useParams } from "react-router-dom";
import CostRatingOptionConfiguration from "../../components/CostRatingOptionConfiguration";

const CostRatingOptionsPage = () => {
  const { id = "" } = useParams();

  return <CostRatingOptionConfiguration groupId={id} />;
};

export default CostRatingOptionsPage;
