import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  FaPencil,
  FaCirclePlus,
  FaCircleXmark,
  FaAnglesRight,
} from "react-icons/fa6";
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
  onMarkVisited: (venue: GroupVenueResult) => void;
  markVisitedDisabled: boolean;
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
  onMarkVisited,
  markVisitedDisabled,
  onMarkDidNotGo,
  noRatingStatus,
  noRatingDisabled,
  useDefaultVenueTypeIcons,
  justRated = false,
}: Props) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const swipeStartRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    captured: boolean;
  } | null>(null);
  const suppressClickUntilRef = useRef(0);
  const hasRatings = venueHasMyRatings(venue);
  const markedNotAttended =
    venue.myQualityRated &&
    venue.myCostRated &&
    venue.myVibeRated &&
    venue.myQualityRating == null &&
    venue.myCostRating == null &&
    venue.myVibeRating == null;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      venue.visited ||
      markVisitedDisabled ||
      event.pointerType === "mouse" ||
      !event.isPrimary
    ) {
      return;
    }

    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      captured: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaY) > 24 && Math.abs(deltaY) > Math.abs(deltaX)) {
      swipeStartRef.current = null;
      setSwipeOffset(0);
      return;
    }

    if (!start.captured && deltaX >= 32 && deltaX > Math.abs(deltaY)) {
      event.currentTarget.setPointerCapture(event.pointerId);
      start.captured = true;
    }
    setSwipeOffset(Math.max(0, Math.min(deltaX, 120)));
  };

  const finishSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || start.pointerId !== event.pointerId) {
      setSwipeOffset(0);
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (deltaX >= 80 && deltaX > Math.abs(deltaY)) {
      suppressClickUntilRef.current = Date.now() + 500;
      onMarkVisited(venue);
    }
    setSwipeOffset(0);
  };

  const cancelSwipe = () => {
    swipeStartRef.current = null;
    setSwipeOffset(0);
  };

  return (
    <div
      className={`venue-card${justRated ? " venue-card-just-rated" : ""}${!venue.visited ? " venue-card-swipe-enabled" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSwipe}
      onPointerCancel={cancelSwipe}
      onClickCapture={(event) => {
        if (Date.now() < suppressClickUntilRef.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClickUntilRef.current = 0;
        }
      }}
    >
      <div
        className={`venue-card-content${swipeOffset > 0 ? " venue-card-content-swiping" : ""}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <button
          type="button"
          className={`venue-card-zone venue-card-details${!venue.visited ? " venue-card-details-swipeable" : ""}`}
          onClick={() => onEditDetails(venue)}
          aria-label={`Edit details for ${venue.venueName}`}
        >
          {!venue.visited && (
            <FaAnglesRight
              className="venue-card-swipe-indicator"
              aria-hidden="true"
            />
          )}
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
          <VisitedIndicator
            visited={venue.visited}
            visitedOn={venue.visitedOn}
          />
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
    </div>
  );
};

export default VenueCard;
