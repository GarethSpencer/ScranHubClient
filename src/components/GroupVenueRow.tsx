import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./common/RatingBar";
import VisitedIndicator from "./venue/VisitedIndicator";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  onSelect: (venue: GroupVenueResult) => void;
}

const GroupVenueRow = ({
  venue,
  qualityOptions,
  costOptions,
  vibeOptions,
  onSelect,
}: Props) => (
  <tr
    role="button"
    className="user-select-none group-venue-row"
    onClick={() => onSelect(venue)}
  >
    <td>{venue.venueName}</td>
    <td>
      <VisitedIndicator
        visited={venue.visited}
        visitedOn={venue.visitedOn}
        size={18}
      />
    </td>
    <td>{venue.venueType}</td>
    <td>{venue.foodType}</td>
    <td>
      <RatingBar average={venue.myQualityRating} options={qualityOptions} />
    </td>
    <td>
      <RatingBar average={venue.myCostRating} options={costOptions} />
    </td>
    <td>
      <RatingBar average={venue.myVibeRating} options={vibeOptions} />
    </td>
  </tr>
);

export default GroupVenueRow;
