import { FaCheck, FaXmark } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  onEditDetails: (venue: GroupVenueResult) => void;
  onEditRatings: (venue: GroupVenueResult) => void;
}

const VenueCard = ({
  venue,
  qualityOptions,
  costOptions,
  onEditDetails,
  onEditRatings,
}: Props) => {
  const summaryParts = [venue.venueType, venue.foodType].filter(Boolean);

  return (
    <div className="venue-card">
      <button
        type="button"
        className="venue-card-zone venue-card-details"
        onClick={() => onEditDetails(venue)}
        aria-label={`Edit details for ${venue.venueName}`}
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
          <div className="venue-card-subheading text-break">
            {summaryParts.join(" · ")}
          </div>
        )}
      </button>

      <button
        type="button"
        className="venue-card-zone venue-card-ratings"
        onClick={() => onEditRatings(venue)}
        aria-label={`Edit your ratings for ${venue.venueName}`}
      >
        <div className="text-muted small mb-1">My ratings</div>
        <div className="venue-card-rating-row">
          <span className="venue-card-rating-label">Quality</span>
          <RatingBar average={venue.myQualityRating} options={qualityOptions} />
        </div>
        <div className="venue-card-rating-row">
          <span className="venue-card-rating-label">Cost</span>
          <RatingBar average={venue.myCostRating} options={costOptions} />
        </div>
      </button>
    </div>
  );
};

export default VenueCard;
