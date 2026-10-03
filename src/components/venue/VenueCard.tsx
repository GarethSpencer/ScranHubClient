import { FaPencil, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";
import SaveButton from "../common/SaveButton";
import type { SaveStatus } from "../../hooks/useSaveFeedback";
import VisitedIndicator from "./VisitedIndicator";
import { formatDistanceMiles, venueHasMyRatings } from "../../lib/venueInfo";

interface Props {
  venue: GroupVenueResult;
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  onEditDetails: (venue: GroupVenueResult) => void;
  onEditRatings: (venue: GroupVenueResult) => void;
  onMarkDidNotGo: (venue: GroupVenueResult) => void;
  noRatingStatus: SaveStatus;
  noRatingDisabled: boolean;
  justRated?: boolean;
}

const VenueCard = ({
  venue,
  qualityOptions,
  costOptions,
  vibeOptions,
  onEditDetails,
  onEditRatings,
  onMarkDidNotGo,
  noRatingStatus,
  noRatingDisabled,
  justRated = false,
}: Props) => {
  const summaryParts = [venue.venueType, venue.foodType].filter(Boolean);
  const hasRatings = venueHasMyRatings(venue);
  const markedNotAttended =
    venue.myQualityRated &&
    venue.myCostRated &&
    venue.myVibeRated &&
    venue.myQualityRating == null &&
    venue.myCostRating == null &&
    venue.myVibeRating == null;

  return (
    <div className={`venue-card${justRated ? " venue-card-just-rated" : ""}`}>
      <button
        type="button"
        className="venue-card-zone venue-card-details"
        onClick={() => onEditDetails(venue)}
        aria-label={`Edit details for ${venue.venueName}`}
      >
        <div className="venue-card-zone-content">
          <div className="venue-card-title">
            <span>
              {venue.venueName}
              {venue.distanceMiles != null && (
                <>
                  {" "}
                  <span className="venue-card-subheading text-nowrap">
                    ({formatDistanceMiles(venue.distanceMiles)})
                  </span>
                </>
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

      {venue.visited && hasRatings && (
        <button
          type="button"
          className="venue-card-zone venue-card-ratings"
          onClick={() => onEditRatings(venue)}
          aria-label={`Edit your ratings for ${venue.venueName}`}
        >
          <div className="venue-card-zone-content">
            <div className="venue-card-subheading mb-1">
              {markedNotAttended ? "Add your ratings" : "My Ratings"}
            </div>
            {!markedNotAttended && (
              <>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Quality</span>
                  <RatingBar
                    average={venue.myQualityRating}
                    options={qualityOptions}
                  />
                </div>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Cost</span>
                  <RatingBar
                    average={venue.myCostRating}
                    options={costOptions}
                  />
                </div>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Vibe</span>
                  <RatingBar
                    average={venue.myVibeRating}
                    options={vibeOptions}
                  />
                </div>
              </>
            )}
          </div>
          <span className="venue-card-zone-icon" aria-hidden="true">
            <FaPencil size={18} />
          </span>
        </button>
      )}

      {venue.visited && !hasRatings && (
        <div className="venue-card-rating-actions">
          <button
            type="button"
            className="venue-card-zone venue-card-ratings venue-card-ratings-empty"
            onClick={() => onEditRatings(venue)}
            aria-label={`Add your ratings for ${venue.venueName}`}
          >
            <div className="venue-card-zone-content">
              <div className="venue-card-subheading">Add your ratings</div>
            </div>
            <span className="venue-card-zone-icon" aria-hidden="true">
              <FaCirclePlus size={18} />
            </span>
          </button>
          <SaveButton
            status={noRatingStatus}
            label={
              <span className="venue-card-subheading venue-card-action-label">
                <span>Didn't make it?</span>
                <FaCircleXmark size={18} aria-hidden="true" />
              </span>
            }
            savingLabel="Saving..."
            savedLabel="Saved"
            variant="danger"
            className="venue-card-zone venue-card-not-attended-button"
            onClick={() => onMarkDidNotGo(venue)}
            disabled={noRatingDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default VenueCard;
