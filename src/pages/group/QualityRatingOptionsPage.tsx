import { useParams } from "react-router-dom";
import QualityRatingOptionConfiguration from "../../components/QualityRatingOptionConfiguration";

const QualityRatingOptionsPage = () => {
  const { id = "" } = useParams();

  return <QualityRatingOptionConfiguration groupId={id} />;
};

export default QualityRatingOptionsPage;
