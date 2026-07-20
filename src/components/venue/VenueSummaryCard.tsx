import { FaChartSimple, FaCircleInfo } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";
import VisitedIndicator from "./VisitedIndicator";
import { formatDistanceMiles, venueHasInfo } from "./venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
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
  vibeOptions,
  memberCount,
  onViewInfo,
  onViewBreakdown,
}: Props) => {
  const summaryParts = [venue.venueType, venue.foodType].filter(Boolean);
  const hasInfo = venueHasInfo(venue);

  const titleContent = (
    <>
      <div className="venue-card-title">
        <span className="text-break">
          {venue.venueName}
          {venue.distanceMiles != null && (
            <span className="text-muted fw-normal ms-2">
              ({formatDistanceMiles(venue.distanceMiles)})
            </span>
          )}
        </span>
      </div>
      {summaryParts.length > 0 && (
        <div className="venue-card-subheading text-break">
          {summaryParts.join(" · ")}
        </div>
      )}
    </>
  );

  const visitedIndicator = (
    <VisitedIndicator visited={venue.visited} visitedOn={venue.visitedOn} />
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
          <div className="venue-card-zone-content">{titleContent}</div>
          {visitedIndicator}
          <span className="venue-card-zone-icon" aria-hidden="true">
            <FaCircleInfo size={18} />
          </span>
        </button>
      ) : (
        <div className="venue-card-zone venue-card-zone-static">
          <div className="venue-card-zone-content">{titleContent}</div>
          {visitedIndicator}
        </div>
      )}

      <button
        type="button"
        className="venue-card-zone venue-card-ratings"
        onClick={() => onViewBreakdown(venue)}
        aria-label={`View rating breakdown for ${venue.venueName}`}
      >
        <div className="venue-card-zone-content">
          <div className="text-muted small fw-bold mb-1">Average Ratings</div>
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
          <RatingSummaryRow
            label="Vibe"
            average={venue.averageVibeRating}
            options={vibeOptions}
            votes={venue.vibeRatingVotes ?? 0}
            memberCount={memberCount}
          />
        </div>
        <span className="venue-card-zone-icon" aria-hidden="true">
          <FaChartSimple size={18} />
        </span>
      </button>
    </div>
  );
};

export default VenueSummaryCard;
