import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingVenueResult from "../models/results/generic/RatingVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import RatingBar from "./common/RatingBar";
import VenueMap from "./common/VenueMap";

interface Props {
  venue: GroupVenueResult | null;
  qualityRatings: RatingVenueResult[];
  costRatings: RatingVenueResult[];
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  isLoading: boolean;
  onClose: () => void;
}

interface UserRatingRow {
  userId: string;
  displayName: string;
  qualityOptionId?: string;
  costOptionId?: string;
}

const displayOrderForOption = (
  options: RatingOptionResult[],
  optionId: string | undefined,
) =>
  optionId === undefined
    ? undefined
    : options.find((option) => option.optionId === optionId)?.displayOrder;

const displayNameForUser = (row: UserRatingRow, currentUserId?: string) =>
  row.userId === currentUserId ? "Me" : row.displayName;

const googleMapsUrl = (venue: GroupVenueResult) => {
  const query = encodeURIComponent(venue.formattedAddress ?? venue.venueName);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return venue.googlePlaceId
    ? `${url}&query_place_id=${encodeURIComponent(venue.googlePlaceId)}`
    : url;
};

const buildUserRatingRows = (
  qualityRatings: RatingVenueResult[],
  costRatings: RatingVenueResult[],
): UserRatingRow[] => {
  const rowsByUser = new Map<string, UserRatingRow>();

  const ensureRow = (rating: RatingVenueResult) => {
    let row = rowsByUser.get(rating.userId);
    if (!row) {
      row = { userId: rating.userId, displayName: rating.displayName };
      rowsByUser.set(rating.userId, row);
    }
    return row;
  };

  for (const rating of qualityRatings) {
    ensureRow(rating).qualityOptionId = rating.optionId;
  }
  for (const rating of costRatings) {
    ensureRow(rating).costOptionId = rating.optionId;
  }

  return [...rowsByUser.values()];
};

const RatingDetailsModal = ({
  venue,
  qualityRatings,
  costRatings,
  qualityOptions,
  costOptions,
  isLoading,
  onClose,
}: Props) => {
  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const rows = buildUserRatingRows(qualityRatings, costRatings);

  rows.sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return 0;
  });

  return (
    <Modal
      show={venue !== null}
      onHide={onClose}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {venue?.latitude != null && venue?.longitude != null && (
          <div className="mb-3">
            <VenueMap
              latitude={venue.latitude}
              longitude={venue.longitude}
              name={venue.venueName}
            />
            {venue.formattedAddress && (
              <p className="small mt-2 mb-0">
                <a
                  href={googleMapsUrl(venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {venue.formattedAddress}
                </a>
              </p>
            )}
            <hr className="my-3" />
          </div>
        )}
        <h3 className="h6 fw-bold mb-1">Rating Breakdown</h3>
        <p className="text-muted small mb-3">
          Every group member's ratings for this venue.
        </p>
        {isLoading ? (
          <p className="text-muted text-center mb-0">Loading ratings…</p>
        ) : rows.length === 0 ? (
          <p className="text-center mb-0">No ratings yet</p>
        ) : (
          <Table
            responsive
            striped="columns"
            className="align-middle text-center border-top"
          >
            <thead>
              <tr>
                <th className="text-start">Member</th>
                <th>Quality</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.userId}>
                  <td className="text-start">
                    {displayNameForUser(row, currentUserId)}
                  </td>
                  <td>
                    <RatingBar
                      average={displayOrderForOption(
                        qualityOptions,
                        row.qualityOptionId,
                      )}
                      options={qualityOptions}
                    />
                  </td>
                  <td>
                    <RatingBar
                      average={displayOrderForOption(
                        costOptions,
                        row.costOptionId,
                      )}
                      options={costOptions}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RatingDetailsModal;
