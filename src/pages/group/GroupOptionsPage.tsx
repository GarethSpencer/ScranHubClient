import { useState } from "react";
import { useParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import OptionConfiguration from "../../components/OptionConfiguration";
import type { OptionController } from "../../api/controllerHooks/useOptionController";

interface OptionSection {
  eventKey: string;
  controller: OptionController;
  title: string;
  helperText: string;
}

const sections: OptionSection[] = [
  {
    eventKey: "foodtypes",
    controller: "FoodTypeOption",
    title: "Food Types",
    helperText: "These options will be stored alphabetically.",
  },
  {
    eventKey: "venuetypes",
    controller: "VenueTypeOption",
    title: "Venue Types",
    helperText: "These options will be stored alphabetically.",
  },
  {
    eventKey: "qualityratings",
    controller: "QualityOption",
    title: "Quality Ratings",
    helperText: "These options should be ordered from 'best' to 'worst'.",
  },
  {
    eventKey: "costratings",
    controller: "CostOption",
    title: "Cost Ratings",
    helperText: "These options should be ordered from 'best' to 'worst'.",
  },
];

const GroupOptionsPage = () => {
  const { id = "" } = useParams();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <>
      <h2 className="lead mb-1">Options</h2>
      <p className="text-muted small mb-3">
        Configure the option sets which can be applied to the venues in this
        group. Expand a section to view and edit its options.
      </p>

      <Accordion
        activeKey={activeKey ?? undefined}
        onSelect={(key) => setActiveKey(typeof key === "string" ? key : null)}
      >
        {sections.map((section) => (
          <Accordion.Item eventKey={section.eventKey} key={section.eventKey}>
            <Accordion.Header>
              <div>
                <span className="fw-semibold">{section.title}</span>
                <span className="d-block text-muted small">
                  {section.helperText}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              {activeKey === section.eventKey && (
                <OptionConfiguration
                  controller={section.controller}
                  groupId={id}
                  heading={section.title}
                  helperText={section.helperText}
                  hideHeading
                />
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

export default GroupOptionsPage;
