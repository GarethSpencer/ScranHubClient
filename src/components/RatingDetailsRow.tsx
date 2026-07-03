import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./common/RatingBar";
import VoteProgressBar from "./VoteProgressBar";
import VisitedIndicator from "./venue/VisitedIndicator";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  memberCount: number;
  onSelect: (venue: GroupVenueResult) => void;
}

const RatingDetailsRow = ({
  venue,
  qualityOptions,
  costOptions,
  memberCount,
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
      <VoteProgressBar
        count={venue.qualityRatingVotes ?? 0}
        total={memberCount}
      />
    </td>
    <td>
      <VoteProgressBar count={venue.costRatingVotes ?? 0} total={memberCount} />
    </td>
    <td>
      <RatingBar
        average={venue.averageQualityRating}
        options={qualityOptions}
      />
    </td>
    <td>
      <RatingBar average={venue.averageCostRating} options={costOptions} />
    </td>
  </tr>
);

export default RatingDetailsRow;
