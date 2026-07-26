import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

export interface SectionTab {
  label: string;
  to: string;
  end?: boolean;
  badgeCount?: number;
  badgeLabel?: string;
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
            {(tab.badgeCount ?? 0) > 0 && (
              <Badge bg="danger" pill className="section-tab-badge">
                {tab.badgeCount}
                {tab.badgeLabel && (
                  <span className="visually-hidden"> {tab.badgeLabel}</span>
                )}
              </Badge>
            )}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default SectionTabs;
