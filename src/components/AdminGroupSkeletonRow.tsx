import Placeholder from "react-bootstrap/Placeholder";

const AdminGroupSkeletonRow = () => (
  <tr aria-hidden="true">
    <Placeholder as="td" animation="glow" className="text-start">
      <Placeholder xs={8} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={3} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={2} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={2} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={7} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={7} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={7} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={4} />
    </Placeholder>
  </tr>
);

export default AdminGroupSkeletonRow;
