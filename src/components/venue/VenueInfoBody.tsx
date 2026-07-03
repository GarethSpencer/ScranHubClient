import type { ReactNode } from "react";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import VenueMap from "../common/VenueMap";
import useGooglePlaceDetails, {
  summariseOpeningHours,
} from "../../hooks/useGooglePlaceDetails";
import { venueHasInfo } from "./venueInfo";

interface Props {
  venue: GroupVenueResult;
}

const googleMapsUrl = (venue: GroupVenueResult) => {
  const query = encodeURIComponent(venue.formattedAddress ?? venue.venueName);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return venue.googlePlaceId
    ? `${url}&query_place_id=${encodeURIComponent(venue.googlePlaceId)}`
    : url;
};

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <span aria-hidden="true"> ↗</span>
    <span className="visually-hidden"> (opens in a new tab)</span>
  </a>
);

const VenueInfoBody = ({ venue }: Props) => {
  const { data: placeDetails, isLoading: isPlaceDetailsLoading } =
    useGooglePlaceDetails(venue.googlePlaceId);

  if (!venueHasInfo(venue)) return null;

  if (isPlaceDetailsLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <VenueMap
        latitude={venue.latitude!}
        longitude={venue.longitude!}
        name={venue.venueName}
      />
      {venue.formattedAddress && (
        <p className="small mt-2 mb-0">
          <ExternalLink href={googleMapsUrl(venue)}>
            {venue.formattedAddress}
          </ExternalLink>
        </p>
      )}
      {placeDetails?.openingHours &&
        (() => {
          const summary = summariseOpeningHours(placeDetails.openingHours);
          return (
            <div className="small mt-2">
              <span className="fw-bold">Opening hours</span>
              {summary.collapsed ? (
                <p className="mb-0">
                  {/^open\b/i.test(summary.collapsed)
                    ? summary.collapsed
                    : `Open every day: ${summary.collapsed}`}
                </p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {summary.days.map((day) => (
                    <li
                      key={day.description}
                      className={day.isToday ? "venue-primary" : undefined}
                    >
                      {day.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })()}
      {placeDetails?.websiteUri && (
        <p className="small mt-2 mb-0">
          <ExternalLink href={placeDetails.websiteUri}>
            Visit the Website
          </ExternalLink>
        </p>
      )}
    </div>
  );
};

export default VenueInfoBody;
