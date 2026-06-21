import { useParams } from "react-router-dom";
import VenueTypeOptionConfiguration from "../../components/VenueTypeOptionConfiguration";

const VenueTypeOptionsPage = () => {
  const { id = "" } = useParams();

  return <VenueTypeOptionConfiguration groupId={id} />;
};

export default VenueTypeOptionsPage;
