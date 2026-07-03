import { FaCheck, FaXmark } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  memberCount: number;
  onSelect: (venue: GroupVenueResult) => void;
}

const RatingSummaryRow = ({
  label,
  average,
  options,
  votes,
  memberCount,
}: {
  label: string;
  average?: number;
  options: RatingOptionResult[];
  votes: number;
  memberCount: number;
}) => (
  <div className="venue-card-rating-row">
    <span className="venue-card-rating-label">{label}</span>
    <div className="venue-summary-value">
      <RatingBar average={average} options={options} />
      <span className="venue-summary-votes">
        {votes} / {memberCount}
      </span>
    </div>
  </div>
);

const VenueSummaryCard = ({
  venue,
  qualityOptions,
  costOptions,
  memberCount,
  onSelect,
}: Props) => {
  const summaryParts = [venue.venueType, venue.foodType].filter(Boolean);

  return (
    <div className="venue-card">
      <button
        type="button"
        className="venue-card-zone"
        onClick={() => onSelect(venue)}
        aria-label={`View rating breakdown for ${venue.venueName}`}
      >
        <div className="venue-card-title">
          <span className="text-break">{venue.venueName}</span>
          {venue.visited ? (
            <FaCheck
              className="text-success flex-shrink-0"
              aria-label="Visited"
              role="img"
            />
          ) : (
            <FaXmark
              className="text-danger flex-shrink-0"
              aria-label="Not visited"
              role="img"
            />
          )}
        </div>
        {summaryParts.length > 0 && (
          <div className="venue-card-subheading text-break mb-2">
            {summaryParts.join(" · ")}
          </div>
        )}
        <div>
          <RatingSummaryRow
            label="Quality"
            average={venue.averageQualityRating}
            options={qualityOptions}
            votes={venue.qualityRatingVotes ?? 0}
            memberCount={memberCount}
          />
          <RatingSummaryRow
            label="Cost"
            average={venue.averageCostRating}
            options={costOptions}
            votes={venue.costRatingVotes ?? 0}
            memberCount={memberCount}
          />
        </div>
      </button>
    </div>
  );
};

export default VenueSummaryCard;
