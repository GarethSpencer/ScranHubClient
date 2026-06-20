import { useParams } from "react-router-dom";
import Todo from "../../components/Todo";

const GroupDetailsPage = () => {
  const params = useParams();
  console.log(params);
  return <Todo />;
};

export default GroupDetailsPage;
