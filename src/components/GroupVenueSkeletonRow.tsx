import Placeholder from "react-bootstrap/Placeholder";

const GroupVenueSkeletonRow = () => (
  <tr aria-hidden="true">
    <td>
      <Placeholder animation="glow">
        <Placeholder xs={10} />
      </Placeholder>
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
);

export default GroupVenueSkeletonRow;
