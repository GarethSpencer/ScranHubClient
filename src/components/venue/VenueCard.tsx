import { FaChartSimple, FaPencil } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";
import VisitedIndicator from "./VisitedIndicator";
import { formatDistanceMiles } from "../../lib/venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  onEditDetails: (venue: GroupVenueResult) => void;
  onEditRatings: (venue: GroupVenueResult) => void;
}

const VenueCard = ({
  venue,
  qualityOptions,
  costOptions,
  vibeOptions,
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
        <div className="venue-card-zone-content">
          <div className="venue-card-title">
            <span className="text-break">
              {venue.venueName}
              {venue.distanceMiles != null && (
                <span className="venue-card-subheading ms-2">
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
        </div>
        <VisitedIndicator visited={venue.visited} visitedOn={venue.visitedOn} />
        <span className="venue-card-zone-icon" aria-hidden="true">
          <FaPencil size={18} />
        </span>
      </button>

      <button
        type="button"
        className="venue-card-zone venue-card-ratings"
        onClick={() => onEditRatings(venue)}
        aria-label={`Edit your ratings for ${venue.venueName}`}
      >
        <div className="venue-card-zone-content">
          <div className="venue-card-subheading mb-1">My Ratings</div>
          <div className="venue-card-rating-row">
            <span className="venue-card-rating-label">Quality</span>
            <RatingBar
              average={venue.myQualityRating}
              options={qualityOptions}
            />
          </div>
          <div className="venue-card-rating-row">
            <span className="venue-card-rating-label">Cost</span>
            <RatingBar average={venue.myCostRating} options={costOptions} />
          </div>
          <div className="venue-card-rating-row">
            <span className="venue-card-rating-label">Vibe</span>
            <RatingBar average={venue.myVibeRating} options={vibeOptions} />
          </div>
        </div>
        <span className="venue-card-zone-icon" aria-hidden="true">
          <FaChartSimple size={18} />
        </span>
      </button>
    </div>
  );
};

export default VenueCard;
