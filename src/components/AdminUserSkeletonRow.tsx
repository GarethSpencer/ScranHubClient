import Placeholder from "react-bootstrap/Placeholder";

const AdminUserSkeletonRow = () => (
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
    <td></td>
  </tr>
);

export default AdminUserSkeletonRow;
