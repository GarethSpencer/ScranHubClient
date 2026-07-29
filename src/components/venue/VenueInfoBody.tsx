import type { ReactNode } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import VenueMap from "../common/VenueMap";
import useGooglePlaceDetails, {
  summariseOpeningHours,
} from "../../hooks/useGooglePlaceDetails";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import { venueHasInfo } from "../../lib/venueInfo";

interface Props {
  venue: GroupVenueResult;
}

interface MapsOrigin {
  formattedAddress?: string;
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
}

const googleMapsUrl = (venue: GroupVenueResult) => {
  const query = encodeURIComponent(venue.formattedAddress ?? venue.venueName);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return venue.googlePlaceId
    ? `${url}&query_place_id=${encodeURIComponent(venue.googlePlaceId)}`
    : url;
};

const googleMapsDirectionsUrl = (
  venue: GroupVenueResult,
  origin: MapsOrigin,
) => {
  const originText = encodeURIComponent(
    origin.formattedAddress ?? `${origin.latitude},${origin.longitude}`,
  );
  const destinationText = encodeURIComponent(
    venue.formattedAddress ?? venue.venueName,
  );
  let url = `https://www.google.com/maps/dir/?api=1&origin=${originText}&destination=${destinationText}`;
  if (origin.googlePlaceId) {
    url += `&origin_place_id=${encodeURIComponent(origin.googlePlaceId)}`;
  }
  if (venue.googlePlaceId) {
    url += `&destination_place_id=${encodeURIComponent(venue.googlePlaceId)}`;
  }
  return url;
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

  const { data: currentUserData } = useGetCurrentUser();
  const currentUser = currentUserData?.user;
  const hasUserLocation =
    currentUser?.latitude != null && currentUser?.longitude != null;

  const mapsUrl = hasUserLocation
    ? googleMapsDirectionsUrl(venue, currentUser)
    : googleMapsUrl(venue);

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
    <Row className="g-2 gx-md-3">
      <Col md={6} className="venue-info-map-col">
        <VenueMap
          latitude={venue.latitude!}
          longitude={venue.longitude!}
          name={venue.venueName}
        />
      </Col>
      <Col md={6} className="d-flex flex-column gap-2 text-center">
        {venue.formattedAddress && (
          <p className="small mb-0">
            <ExternalLink href={mapsUrl}>
              {venue.formattedAddress}
              {hasUserLocation && " · Directions"}
            </ExternalLink>
          </p>
        )}
        {placeDetails?.openingHours &&
          (() => {
            const summary = summariseOpeningHours(placeDetails.openingHours);
            return (
              <div className="small">
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
          <p className="small mb-0">
            <ExternalLink href={placeDetails.websiteUri}>
              Visit the Website
            </ExternalLink>
          </p>
        )}
      </Col>
    </Row>
  );
};

export default VenueInfoBody;
