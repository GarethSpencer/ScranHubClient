import { FaCheck, FaXmark } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";
import { venueHasInfo } from "./venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  memberCount: number;
  onViewInfo: (venue: GroupVenueResult) => void;
  onViewBreakdown: (venue: GroupVenueResult) => void;
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
  onViewInfo,
  onViewBreakdown,
}: Props) => {
  const summaryParts = [venue.venueType, venue.foodType].filter(Boolean);
  const hasInfo = venueHasInfo(venue);

  const titleContent = (
    <>
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
        <div className="venue-card-subheading text-break">
          {summaryParts.join(" · ")}
        </div>
      )}
    </>
  );

  return (
    <div className="venue-card">
      {hasInfo ? (
        <button
          type="button"
          className="venue-card-zone"
          onClick={() => onViewInfo(venue)}
          aria-label={`View location details for ${venue.venueName}`}
        >
          {titleContent}
        </button>
      ) : (
        <div className="venue-card-zone venue-card-zone-static">
          {titleContent}
        </div>
      )}

      <button
        type="button"
        className="venue-card-zone venue-card-ratings"
        onClick={() => onViewBreakdown(venue)}
        aria-label={`View rating breakdown for ${venue.venueName}`}
      >
        <div className="text-muted small mb-1">Average ratings</div>
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
      </button>
    </div>
  );
};

export default VenueSummaryCard;
