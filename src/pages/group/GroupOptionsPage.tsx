import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import OptionConfiguration from "../../components/OptionConfiguration";
import {
  optionsForGroupQueryOptions,
  useGetOptionsForGroup,
  type OptionController,
} from "../../api/controllerHooks/useOptionController";

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
  {
    eventKey: "viberatings",
    controller: "VibeOption",
    title: "Vibe Ratings",
    helperText: "These options should be ordered from 'best' to 'worst'.",
  },
];

const OptionSourceBadge = ({
  controller,
  groupId,
}: {
  controller: OptionController;
  groupId: string;
}) => {
  const { data } = useGetOptionsForGroup(controller, groupId);

  if (!data) return null;

  const isCustom = (data.options ?? []).some(
    (option) => option.groupId === groupId,
  );

  return (
    <Badge
      bg={isCustom ? "warning" : "primary"}
      className="ms-auto me-3 fw-normal"
    >
      {isCustom ? "Custom" : "Default"}
    </Badge>
  );
};

const GroupOptionsPage = () => {
  const { id = "" } = useParams();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;
    sections.forEach((section) => {
      queryClient.prefetchQuery(
        optionsForGroupQueryOptions(section.controller, id),
      );
    });
  }, [id, queryClient]);

  return (
    <>
      <h2 className="lead mb-1">Manage Options</h2>
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
              <div className="d-flex align-items-center flex-grow-1">
                <div>
                  <span className="fw-semibold">{section.title}</span>
                  <span className="d-block text-muted small">
                    {section.helperText}
                  </span>
                </div>
                <OptionSourceBadge
                  controller={section.controller}
                  groupId={id}
                />
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
