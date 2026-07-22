import { useParams } from "react-router-dom";
import { MAX_VENUE_NAME_LENGTH } from "../../constants/validation";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useGetOptionsForGroup } from "../../api/controllerHooks/useOptionController";
import { useGetRatingsForGroup } from "../../api/controllerHooks/useRatingController";
import { useGetGroupMembers } from "../../api/controllerHooks/useGroupController";
import TableStatus from "../../components/common/TableStatus";
import TableScrollContainer from "../../components/common/TableScrollContainer";
import TablePagination from "../../components/common/TablePagination";
import RatingDetailsRow from "../../components/RatingDetailsRow";
import RatingDetailsSkeletonRow from "../../components/RatingDetailsSkeletonRow";
import RatingDetailsModal from "../../components/RatingDetailsModal";
import VenueSummaryCard from "../../components/venue/VenueSummaryCard";
import VenueInfoModal from "../../components/venue/VenueInfoModal";
import VenueBreakdownModal from "../../components/venue/VenueBreakdownModal";
import MobileSortControl from "../../components/venue/MobileSortControl";
import TablePageSizeSelect from "../../components/common/TablePageSizeSelect";
import useGroupVenueListing, {
  type VenueListingColumn,
} from "../../hooks/useGroupVenueListing";
import useIsMobile from "../../hooks/useIsMobile";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingVenueResult from "../../models/results/generic/RatingVenueResult";
import type GroupVenueRatingResult from "../../models/results/generic/GroupVenueRatingResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";
import { SEARCH_PAGE_SIZE } from "../../constants/pagination";

const BASE_COLUMNS: VenueListingColumn[] = [
  { label: "Name", sortBy: GroupVenueSortParameters.VenueName },
  { label: "Visited", sortBy: GroupVenueSortParameters.VisitedOn },
  { label: "Venue Type", sortBy: GroupVenueSortParameters.VenueType },
  { label: "Food Type", sortBy: GroupVenueSortParameters.FoodType },
  {
    label: "Quality Votes",
    sortBy: GroupVenueSortParameters.QualityRatingVotes,
  },
  { label: "Cost Votes", sortBy: GroupVenueSortParameters.CostRatingVotes },
  { label: "Vibe Votes", sortBy: GroupVenueSortParameters.VibeRatingVotes },
  { label: "Avg Quality", sortBy: GroupVenueSortParameters.AvgQualityRating },
  { label: "Avg Cost", sortBy: GroupVenueSortParameters.AvgCostRating },
  { label: "Avg Vibe", sortBy: GroupVenueSortParameters.AvgVibeRating },
];

const ratingsForVenue = (
  groupVenueRatings: GroupVenueRatingResult[] | undefined,
  groupVenueId: string,
): RatingVenueResult[] =>
  groupVenueRatings?.find((x) => x.groupVenueId === groupVenueId)?.ratings ??
  [];

const RatingDetailsPage = () => {
  const { id = "" } = useParams();

  const isMobile = useIsMobile();

  const [infoVenue, setInfoVenue] = useState<GroupVenueResult | null>(null);
  const [breakdownVenue, setBreakdownVenue] = useState<GroupVenueResult | null>(
    null,
  );

  const {
    columns,
    hasUserLocation,
    searchText,
    onSearchTextChange,
    isSearching,
    searchResults,
    searchTotalCount,
    isSearchLoading,
    isSearchError,
    searchPage,
    setSearchPage,
    venues,
    totalCount,
    isVenuesLoading,
    isVenuesPending,
    isVenuesError,
    page,
    setPage,
    pageSize,
    onPageSizeChange,
    sortBy,
    sortDescending,
    onSort,
    onSortByChange,
    onToggleDirection,
    showSearch,
    skeletonRowCount,
  } = useGroupVenueListing(id, BASE_COLUMNS);

  const { data: qualityOptionData } = useGetOptionsForGroup(
    "QualityOption",
    id,
  );
  const { data: costOptionData } = useGetOptionsForGroup("CostOption", id);
  const { data: vibeOptionData } = useGetOptionsForGroup("VibeOption", id);
  const qualityOptions = qualityOptionData?.options ?? [];
  const costOptions = costOptionData?.options ?? [];
  const vibeOptions = vibeOptionData?.options ?? [];

  const { data: qualityRatingsData, isLoading: isQualityRatingsLoading } =
    useGetRatingsForGroup("QualityRating", id);
  const { data: costRatingsData, isLoading: isCostRatingsLoading } =
    useGetRatingsForGroup("CostRating", id);
  const { data: vibeRatingsData, isLoading: isVibeRatingsLoading } =
    useGetRatingsForGroup("VibeRating", id);

  const areRatingsLoading =
    isQualityRatingsLoading || isCostRatingsLoading || isVibeRatingsLoading;

  const { data: membersData } = useGetGroupMembers(id, {
    pageNumber: 1,
    pageSize: 1,
  });
  const memberCount = membersData?.totalCount ?? 0;

  const breakdownVenueId = breakdownVenue?.groupVenueId ?? "";

  const breakdownQualityRatings = ratingsForVenue(
    qualityRatingsData?.groupVenueRatingsResults,
    breakdownVenueId,
  );
  const breakdownCostRatings = ratingsForVenue(
    costRatingsData?.groupVenueRatingsResults,
    breakdownVenueId,
  );
  const breakdownVibeRatings = ratingsForVenue(
    vibeRatingsData?.groupVenueRatingsResults,
    breakdownVenueId,
  );

  return (
    <>
      <h2 className="mb-1 lead">Summary</h2>
      <p className="text-muted small mb-3">
        View the details of each venue, plus Google Maps info if available. You
        can view ratings once a venue has been visited.
      </p>

      {!isMobile && (
        <RatingDetailsModal
          venue={breakdownVenue}
          qualityRatings={breakdownQualityRatings}
          costRatings={breakdownCostRatings}
          vibeRatings={breakdownVibeRatings}
          qualityOptions={qualityOptions}
          costOptions={costOptions}
          vibeOptions={vibeOptions}
          isLoading={areRatingsLoading}
          onClose={() => setBreakdownVenue(null)}
        />
      )}
      {isMobile && (
        <>
          <VenueInfoModal
            venue={infoVenue}
            onClose={() => setInfoVenue(null)}
          />
          <VenueBreakdownModal
            venue={breakdownVenue}
            qualityRatings={breakdownQualityRatings}
            costRatings={breakdownCostRatings}
            vibeRatings={breakdownVibeRatings}
            qualityOptions={qualityOptions}
            costOptions={costOptions}
            vibeOptions={vibeOptions}
            isLoading={areRatingsLoading}
            onClose={() => setBreakdownVenue(null)}
          />
        </>
      )}

      {showSearch && (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="ratingDetailsSearch">
            <Form.Control
              type="text"
              placeholder="Search venues by name or type"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              disabled={isVenuesLoading}
              maxLength={MAX_VENUE_NAME_LENGTH}
            />
          </Form.Group>
        </Form>
      )}

      {isSearching ? (
        <TableStatus
          isLoading={isSearchLoading}
          isError={isSearchError}
          isEmpty={searchResults.length === 0}
          loadingText="Searching venues..."
          errorText="Couldn't search venues. Please try again."
          emptyText="No venues match your search"
        >
          <TableScrollContainer className="d-none d-md-block">
            <Table
              striped="columns"
              className="align-middle text-center border-top group-venue-table"
            >
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map((x: GroupVenueResult) => (
                  <RatingDetailsRow
                    key={x.groupVenueId}
                    venue={x}
                    qualityOptions={qualityOptions}
                    costOptions={costOptions}
                    vibeOptions={vibeOptions}
                    memberCount={memberCount}
                    showDistance={hasUserLocation}
                    onSelect={setBreakdownVenue}
                  />
                ))}
              </tbody>
            </Table>
          </TableScrollContainer>

          <div className="d-md-none venue-card-list border-top">
            {searchResults.map((x: GroupVenueResult) => (
              <VenueSummaryCard
                key={x.groupVenueId}
                venue={x}
                qualityOptions={qualityOptions}
                costOptions={costOptions}
                vibeOptions={vibeOptions}
                memberCount={memberCount}
                onViewInfo={setInfoVenue}
                onViewBreakdown={setBreakdownVenue}
              />
            ))}
          </div>

          <div className="d-flex justify-content-center">
            <TablePagination
              page={searchPage}
              totalCount={searchTotalCount}
              pageSize={SEARCH_PAGE_SIZE}
              onPageChange={setSearchPage}
            />
          </div>
        </TableStatus>
      ) : isVenuesError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load venues. Please try again.
        </p>
      ) : !isVenuesPending && venues.length === 0 ? (
        <p className="text-center mb-0">No venues yet</p>
      ) : (
        <>
          <TableScrollContainer className="d-none d-md-block">
            <Table
              striped="columns"
              className="align-middle text-center border-top group-venue-table"
            >
              <thead>
                <tr>
                  {columns.map((column) =>
                    column.sortBy === undefined ? (
                      <th key={column.label}>{column.label}</th>
                    ) : (
                      <th
                        key={column.label}
                        role="button"
                        aria-sort={
                          sortBy === column.sortBy
                            ? sortDescending
                              ? "descending"
                              : "ascending"
                            : "none"
                        }
                        onClick={() => onSort(column.sortBy!)}
                        className="user-select-none"
                      >
                        {column.label}{" "}
                        {sortBy === column.sortBy ? (
                          sortDescending ? (
                            <FaSortDown />
                          ) : (
                            <FaSortUp />
                          )
                        ) : (
                          <FaSort className="text-muted" />
                        )}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {isVenuesPending
                  ? Array.from({ length: skeletonRowCount }, (_, index) => (
                      <RatingDetailsSkeletonRow
                        key={index}
                        showDistance={hasUserLocation}
                      />
                    ))
                  : venues.map((x: GroupVenueResult) => (
                      <RatingDetailsRow
                        key={x.groupVenueId}
                        venue={x}
                        qualityOptions={qualityOptions}
                        costOptions={costOptions}
                        vibeOptions={vibeOptions}
                        memberCount={memberCount}
                        showDistance={hasUserLocation}
                        onSelect={setBreakdownVenue}
                      />
                    ))}
              </tbody>
            </Table>
          </TableScrollContainer>

          {!isVenuesPending && (
            <div className="d-md-none">
              <MobileSortControl
                id="ratingDetailsMobileSort"
                options={columns
                  .filter(
                    (
                      c,
                    ): c is VenueListingColumn & {
                      sortBy: GroupVenueSortParameters;
                    } => c.sortBy !== undefined,
                  )
                  .map((c) => ({ label: c.label, value: c.sortBy }))}
                sortBy={sortBy}
                sortDescending={sortDescending}
                onSortByChange={onSortByChange}
                onToggleDirection={onToggleDirection}
              />
            </div>
          )}

          <div className="d-md-none venue-card-list border-top">
            {isVenuesPending
              ? Array.from({ length: skeletonRowCount }, (_, index) => (
                  <div key={index} className="venue-card venue-card-skeleton" />
                ))
              : venues.map((x: GroupVenueResult) => (
                  <VenueSummaryCard
                    key={x.groupVenueId}
                    venue={x}
                    qualityOptions={qualityOptions}
                    costOptions={costOptions}
                    vibeOptions={vibeOptions}
                    memberCount={memberCount}
                    onViewInfo={setInfoVenue}
                    onViewBreakdown={setBreakdownVenue}
                  />
                ))}
          </div>

          <div className="pagination-row">
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <TablePageSizeSelect
              id="ratingDetailsPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default RatingDetailsPage;
