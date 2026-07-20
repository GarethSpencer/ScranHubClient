import Placeholder from "react-bootstrap/Placeholder";

interface Props {
  showDistance: boolean;
}

const GroupVenueSkeletonRow = ({ showDistance }: Props) => (
  <tr aria-hidden="true">
    <Placeholder as="td" animation="glow">
      <Placeholder xs={8} />
    </Placeholder>
    {showDistance && (
      <Placeholder as="td" animation="glow">
        <Placeholder xs={5} />
      </Placeholder>
    )}
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
      <Placeholder xs={9} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={9} />
    </Placeholder>
    <Placeholder as="td" animation="glow">
      <Placeholder xs={9} />
    </Placeholder>
  </tr>
);

export default GroupVenueSkeletonRow;
