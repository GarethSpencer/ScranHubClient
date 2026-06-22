import type GroupVenueResult from "../models/results/GroupVenueResult";

interface Props {
  venue: GroupVenueResult;
  onSelect: (venue: GroupVenueResult) => void;
}

const GroupVenueRow = ({ venue, onSelect }: Props) => (
  <tr
    role="button"
    className="user-select-none group-venue-row"
    onClick={() => onSelect(venue)}
  >
    <td>{venue.venueName}</td>
    <td>{venue.visited ? "Yes" : "No"}</td>
    <td>{venue.venueType}</td>
    <td>{venue.foodType}</td>
  </tr>
);

export default GroupVenueRow;
