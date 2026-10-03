import { FaPencil, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";
import SaveButton from "../common/SaveButton";
import type { SaveStatus } from "../../hooks/useSaveFeedback";
import VisitedIndicator from "./VisitedIndicator";
import VenueTypeSummary from "./VenueTypeSummary";
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
  useDefaultVenueTypeIcons: boolean;
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
  useDefaultVenueTypeIcons,
  justRated = false,
}: Props) => {
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
          <VenueTypeSummary
            venueType={venue.venueType}
            foodType={venue.foodType}
            useDefaultVenueTypeIcons={useDefaultVenueTypeIcons}
          />
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
            className="venue-card-rating-action venue-card-rating-action-add"
            onClick={() => onEditRatings(venue)}
            aria-label={`Add your ratings for ${venue.venueName}`}
          >
            <span className="venue-card-action-label">
              <span>Add your ratings</span>
              <FaCirclePlus
                className="venue-card-action-icon"
                size={18}
                aria-hidden="true"
              />
            </span>
          </button>
          <SaveButton
            status={noRatingStatus}
            label={
              <span className="venue-card-action-label">
                <span>Didn't make it?</span>
                <FaCircleXmark
                  className="venue-card-action-icon"
                  size={18}
                  aria-hidden="true"
                />
              </span>
            }
            savingLabel="Saving..."
            savedLabel="Saved"
            variant="primary"
            className="venue-card-rating-action venue-card-rating-action-no-rating"
            onClick={() => onMarkDidNotGo(venue)}
            disabled={noRatingDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default VenueCard;
