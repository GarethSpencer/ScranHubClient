import Table from "react-bootstrap/Table";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import type RatingVenueResult from "../../models/results/generic/RatingVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import RatingBar from "../common/RatingBar";

interface Props {
  qualityRatings: RatingVenueResult[];
  costRatings: RatingVenueResult[];
  vibeRatings: RatingVenueResult[];
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
}

interface UserRatingRow {
  userId: string;
  displayName: string;
  qualityOptionId?: string;
  costOptionId?: string;
  vibeOptionId?: string;
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

const buildUserRatingRows = (
  qualityRatings: RatingVenueResult[],
  costRatings: RatingVenueResult[],
  vibeRatings: RatingVenueResult[],
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
  for (const rating of vibeRatings) {
    ensureRow(rating).vibeOptionId = rating.optionId;
  }

  return [...rowsByUser.values()];
};

const VenueBreakdownBody = ({
  qualityRatings,
  costRatings,
  vibeRatings,
  qualityOptions,
  costOptions,
  vibeOptions,
}: Props) => {
  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const rows = buildUserRatingRows(qualityRatings, costRatings, vibeRatings);

  rows.sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return 0;
  });

  return (
    <>
      <h3 className="h6 fw-bold mb-1">Rating Breakdown</h3>
      <p className="text-muted small mb-3">
        Every group member's ratings for this venue.
      </p>
      {rows.length === 0 ? (
        <p className="text-center mb-0">No ratings yet</p>
      ) : (
        <>
          <Table
            responsive
            striped="columns"
            className="d-none d-md-table align-middle text-center border-top"
          >
            <thead>
              <tr>
                <th className="text-start">Member</th>
                <th>Quality</th>
                <th>Cost</th>
                <th>Vibe</th>
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
                  <td>
                    <RatingBar
                      average={displayOrderForOption(
                        vibeOptions,
                        row.vibeOptionId,
                      )}
                      options={vibeOptions}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-md-none venue-breakdown-list border-top">
            {rows.map((row) => (
              <div key={row.userId} className="venue-breakdown-user">
                <div className="fw-bold mb-1 text-break">
                  {displayNameForUser(row, currentUserId)}
                </div>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Quality</span>
                  <RatingBar
                    average={displayOrderForOption(
                      qualityOptions,
                      row.qualityOptionId,
                    )}
                    options={qualityOptions}
                  />
                </div>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Cost</span>
                  <RatingBar
                    average={displayOrderForOption(
                      costOptions,
                      row.costOptionId,
                    )}
                    options={costOptions}
                  />
                </div>
                <div className="venue-card-rating-row">
                  <span className="venue-card-rating-label">Vibe</span>
                  <RatingBar
                    average={displayOrderForOption(
                      vibeOptions,
                      row.vibeOptionId,
                    )}
                    options={vibeOptions}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default VenueBreakdownBody;
