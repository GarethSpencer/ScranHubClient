import Placeholder from "react-bootstrap/Placeholder";

const RatingDetailsSkeletonRow = () => (
  <tr aria-hidden="true">
    <Placeholder as="td" animation="glow" className="text-start">
      <Placeholder xs={8} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={4} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={7} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={7} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={2} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={2} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={9} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={9} />
    </Placeholder>
  </tr>
);

export default RatingDetailsSkeletonRow;
