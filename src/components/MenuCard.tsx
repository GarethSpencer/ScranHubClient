import Card from "react-bootstrap/Card";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface Props {
  text: string;
  link: string;
  variant: string;
  icon: IconType;
}

const MenuCard = ({ text, link, variant, icon: Icon }: Props) => {
  return (
    <Card
      as={Link}
      to={link}
      bg={variant}
      key={text}
      className="text-decoration-none text-center text-white py-md-3 shadow menu-card"
    >
      <Card.Body>
        <div className="d-flex flex-row flex-md-column align-items-center justify-content-between justify-content-md-center">
          <Card.Text className="lead mb-0 mb-md-3">{text}</Card.Text>
          <Icon className="menu-card-icon" />
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuCard;
