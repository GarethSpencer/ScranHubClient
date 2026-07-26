import Badge from "react-bootstrap/Badge";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./common/RatingBar";
import VisitedIndicator from "./venue/VisitedIndicator";
import { formatDistanceMiles, venueNeedsMyRatings } from "../lib/venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  showDistance: boolean;
  onSelect: (venue: GroupVenueResult) => void;
  justRated?: boolean;
}

const GroupVenueRow = ({
  venue,
  qualityOptions,
  costOptions,
  vibeOptions,
  showDistance,
  onSelect,
  justRated = false,
}: Props) => {
  const needsRatings = venueNeedsMyRatings(venue);

  return (
    <tr
      role="button"
      className={`user-select-none group-venue-row${
        needsRatings ? " group-venue-row-needs-ratings" : ""
      }${justRated ? " group-venue-row-just-rated" : ""}`}
      onClick={() => onSelect(venue)}
    >
      <td>
        <span className="venue-name-cell">
          <span className="text-break">{venue.venueName}</span>
          {needsRatings && (
            <Badge bg="success" pill className="venue-needs-ratings">
              Add Ratings
            </Badge>
          )}
        </span>
      </td>
      {showDistance && (
        <td>
          {venue.distanceMiles != null
            ? formatDistanceMiles(venue.distanceMiles)
            : "—"}
        </td>
      )}
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
};

export default GroupVenueRow;
