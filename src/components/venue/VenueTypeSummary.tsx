import { MdTableRestaurant } from "react-icons/md";
import { RiTakeawayFill } from "react-icons/ri";

interface Props {
  venueType?: string;
  foodType?: string;
  useDefaultVenueTypeIcons: boolean;
}

const VenueTypeSummary = ({
  venueType,
  foodType,
  useDefaultVenueTypeIcons,
}: Props) => {
  const normalizedVenueType = venueType?.trim().toLowerCase();
  const isBoth = normalizedVenueType === "both";
  const isEatIn = normalizedVenueType === "eat-in";
  const isTakeaway = normalizedVenueType === "takeaway";
  const showIcons =
    useDefaultVenueTypeIcons && (isBoth || isEatIn || isTakeaway);

  if (!venueType && !foodType) return null;

  return (
    <div className="venue-card-subheading text-break">
      {venueType &&
        (showIcons ? (
          <span
            className="venue-type-icons d-inline-flex align-items-center gap-1"
            role="img"
            aria-label={venueType}
            title={venueType}
          >
            {(isBoth || isTakeaway) && (
              <RiTakeawayFill size={18} aria-hidden="true" />
            )}
            {(isBoth || isEatIn) && (
              <MdTableRestaurant size={18} aria-hidden="true" />
            )}
          </span>
        ) : (
          venueType
        ))}
      {venueType && foodType && " · "}
      {foodType}
    </div>
  );
};

export default VenueTypeSummary;
