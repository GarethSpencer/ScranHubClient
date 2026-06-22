import type GroupVenueResult from "../models/results/GroupVenueResult";

interface Props {
  venue: GroupVenueResult;
}

const GroupVenueRow = ({ venue }: Props) => (
  <tr>
    <td>{venue.venueName}</td>
    <td>{venue.visited ? "Yes" : "No"}</td>
    <td>{venue.venueType}</td>
    <td>{venue.foodType}</td>
  </tr>
);

export default GroupVenueRow;
