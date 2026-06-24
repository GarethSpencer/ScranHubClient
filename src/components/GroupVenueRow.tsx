import { FaCheck, FaXmark } from "react-icons/fa6";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./RatingBar";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  onSelect: (venue: GroupVenueResult) => void;
}

const GroupVenueRow = ({
  venue,
  qualityOptions,
  costOptions,
  onSelect,
}: Props) => (
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
    <td>
      <RatingBar average={venue.myQualityRating} options={qualityOptions} />
    </td>
    <td>
      <RatingBar average={venue.myCostRating} options={costOptions} />
    </td>
  </tr>
);

export default GroupVenueRow;
