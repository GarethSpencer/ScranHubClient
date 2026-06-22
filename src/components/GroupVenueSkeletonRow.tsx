import Placeholder from "react-bootstrap/Placeholder";

const GroupVenueSkeletonRow = () => (
  <tr aria-hidden="true">
    <td>
      <Placeholder animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
    </td>
    <td>
      <Placeholder animation="glow">
        <Placeholder xs={1} />
      </Placeholder>
    </td>
    <td>
      <Placeholder animation="glow">
        <Placeholder xs={3} />
      </Placeholder>
    </td>
    <td>
      <Placeholder animation="glow">
        <Placeholder xs={3} />
      </Placeholder>
    </td>
  </tr>
);

export default GroupVenueSkeletonRow;
