import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

export interface SectionTab {
  label: string;
  to: string;
  end?: boolean;
}

interface Props {
  tabs: SectionTab[];
  className?: string;
}

const SectionTabs = ({ tabs, className }: Props) => {
  if (tabs.length < 2) return null;

  return (
    <Nav
      variant="tabs"
      className={["section-tabs", className].filter(Boolean).join(" ")}
    >
      {tabs.map((tab) => (
        <Nav.Item key={tab.to}>
          <Nav.Link as={NavLink} to={tab.to} end={tab.end}>
            {tab.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default SectionTabs;
