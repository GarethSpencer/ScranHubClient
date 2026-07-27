import { useCallback, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import Celebration from "../components/common/Celebration";
import SectionTabBadge from "./SectionTabBadge";

export interface SectionTab {
  label: string;
  to: string;
  end?: boolean;
  badgeCount?: number;
  badgeLabel?: string;
  shouldCelebrateAtZero?: () => boolean;
}

interface Props {
  tabs: SectionTab[];
  className?: string;
}

const SectionTabs = ({ tabs, className }: Props) => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const startCelebrating = useCallback(() => setIsCelebrating(true), []);
  const stopCelebrating = useCallback(() => setIsCelebrating(false), []);

  if (tabs.length < 2) return null;

  return (
    <>
      <Nav
        variant="tabs"
        className={["section-tabs", className].filter(Boolean).join(" ")}
      >
        {tabs.map((tab) => {
          const shouldCelebrate = tab.shouldCelebrateAtZero;

          return (
            <Nav.Item key={tab.to}>
              <Nav.Link as={NavLink} to={tab.to} end={tab.end}>
                {tab.label}
                <SectionTabBadge
                  count={tab.badgeCount ?? 0}
                  label={tab.badgeLabel}
                  onCleared={
                    shouldCelebrate
                      ? () => {
                          if (shouldCelebrate()) startCelebrating();
                        }
                      : undefined
                  }
                />
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      {isCelebrating && <Celebration onDone={stopCelebrating} />}
    </>
  );
};

export default SectionTabs;
