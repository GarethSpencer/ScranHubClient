import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./common/RatingBar";
import VoteProgressBar from "./VoteProgressBar";
import VisitedIndicator from "./venue/VisitedIndicator";
import { formatDistanceMiles } from "../lib/venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  memberCount: number;
  showDistance: boolean;
  onSelect: (venue: GroupVenueResult) => void;
}

const RatingDetailsRow = ({
  venue,
  qualityOptions,
  costOptions,
  vibeOptions,
  memberCount,
  showDistance,
  onSelect,
}: Props) => (
  <tr
    role="button"
    className="user-select-none group-venue-row"
    onClick={() => onSelect(venue)}
  >
    <td>{venue.venueName}</td>
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
      {venue.visited ? (
        <VoteProgressBar
          count={venue.qualityRatingVotes ?? 0}
          total={memberCount}
        />
      ) : (
        "—"
      )}
    </td>
    <td>
      {venue.visited ? (
        <VoteProgressBar
          count={venue.costRatingVotes ?? 0}
          total={memberCount}
        />
      ) : (
        "—"
      )}
    </td>
    <td>
      {venue.visited ? (
        <VoteProgressBar
          count={venue.vibeRatingVotes ?? 0}
          total={memberCount}
        />
      ) : (
        "—"
      )}
    </td>
    <td>
      <RatingBar
        average={venue.visited ? venue.averageQualityRating : undefined}
        options={qualityOptions}
      />
    </td>
    <td>
      <RatingBar
        average={venue.visited ? venue.averageCostRating : undefined}
        options={costOptions}
      />
    </td>
    <td>
      <RatingBar
        average={venue.visited ? venue.averageVibeRating : undefined}
        options={vibeOptions}
      />
    </td>
  </tr>
);

export default RatingDetailsRow;
