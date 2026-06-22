import { FaCheck, FaXmark } from "react-icons/fa6";
import type GroupVenueResult from "../models/results/GroupVenueResult";

interface Props {
  venue: GroupVenueResult;
  onSelect: (venue: GroupVenueResult) => void;
}

const formatRating = (rating?: number) =>
  rating == null ? "—" : rating.toFixed(1);

const GroupVenueRow = ({ venue, onSelect }: Props) => (
  <tr
    role="button"
    className="user-select-none group-venue-row"
    onClick={() => onSelect(venue)}
  >
    <td>{venue.venueName}</td>
    <td>
      {venue.visited ? (
        <FaCheck
          className="text-success"
          size={18}
          aria-label="Visited"
          role="img"
        />
      ) : (
        <FaXmark
          className="text-danger"
          size={18}
          aria-label="Not visited"
          role="img"
        />
      )}
    </td>
    <td>{venue.venueType}</td>
    <td>{venue.foodType}</td>
    <td>{formatRating(venue.averageQualityRating)}</td>
    <td>{formatRating(venue.averageCostRating)}</td>
  </tr>
);

export default GroupVenueRow;
