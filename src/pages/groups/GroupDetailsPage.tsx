import { useParams } from "react-router-dom";
import Todo from "../../components/Todo";

const GroupDetailsPage = () => {
  const params = useParams();
  console.log(params);
  return (
    <div className="content-wrapper">
      <Todo />
    </div>
  );
};

export default GroupDetailsPage;
