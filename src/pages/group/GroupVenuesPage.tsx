import { useParams } from "react-router-dom";
import { MAX_VENUE_NAME_LENGTH } from "../../constants/validation";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useGetOptionsForGroup } from "../../api/controllerHooks/useOptionController";
import {
  useCreateRating,
  useInvalidateRatingQueries,
} from "../../api/controllerHooks/useRatingController";
import { useUpdateGroupVenue } from "../../api/controllerHooks/useGroupVenueController";
import { todayDateInputValue } from "../../lib/date";
import useToast from "../../contexts/toast/useToast";
import TableStatus from "../../components/common/TableStatus";
import TableScrollContainer from "../../components/common/TableScrollContainer";
import InfiniteScrollLoader from "../../components/common/InfiniteScrollLoader";
import GroupVenueRow from "../../components/GroupVenueRow";
import GroupVenueSkeletonRow from "../../components/GroupVenueSkeletonRow";
import CreateGroupVenueModal from "../../components/CreateGroupVenueModal";
import GroupVenueModal from "../../components/GroupVenueModal";
import VenueCard from "../../components/venue/VenueCard";
import VenueDetailsModal from "../../components/venue/VenueDetailsModal";
import VenueRatingsModal from "../../components/venue/VenueRatingsModal";
import MobileSortControl, {
  MobileSortSkeleton,
} from "../../components/venue/MobileSortControl";
import useGroupVenueListing, {
  type VenueListingColumn,
} from "../../hooks/useGroupVenueListing";
import useIsMobile from "../../hooks/useIsMobile";
import useJustRated from "../../hooks/useJustRated";
import useSaveFeedback from "../../hooks/useSaveFeedback";
import useRatingCelebration from "../../contexts/ratingCelebration/useRatingCelebration";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";

const optionIdForLabel = (
  options: RatingOptionResult[],
  label: string | undefined,
) => options.find((option) => option.label === label)?.optionId;

const BASE_COLUMNS: VenueListingColumn[] = [
  { label: "Name", sortBy: GroupVenueSortParameters.VenueName },
  { label: "Visited", sortBy: GroupVenueSortParameters.VisitedOn },
  { label: "Venue Type", sortBy: GroupVenueSortParameters.VenueType },
  { label: "Food Type", sortBy: GroupVenueSortParameters.FoodType },
  {
    label: "My Quality",
    sortBy: GroupVenueSortParameters.MyQualityRating,
  },
  { label: "My Cost", sortBy: GroupVenueSortParameters.MyCostRating },
  { label: "My Vibe", sortBy: GroupVenueSortParameters.MyVibeRating },
];

const GroupVenuesPage = () => {
  const { id = "" } = useParams();

  const isMobile = useIsMobile();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailsVenue, setDetailsVenue] = useState<GroupVenueResult | null>(
    null,
  );
  const [ratingsVenue, setRatingsVenue] = useState<GroupVenueResult | null>(
    null,
  );
  const [refreshingRatingsCount, setRefreshingRatingsCount] = useState(0);
  const [isRefreshingVisitedVenue, setIsRefreshingVisitedVenue] =
    useState(false);

  const { justRatedId, markJustRated } = useJustRated();
  const noRatingSave = useSaveFeedback();
  const { showToast } = useToast();
  const { notifyRatingsSaved } = useRatingCelebration();
  const invalidateRatingQueries = useInvalidateRatingQueries();
  const { mutate: updateGroupVenue, isPending: isUpdatingGroupVenue } =
    useUpdateGroupVenue(id, {
      awaitVenueRefresh: true,
      onVenueRefreshStart: () => setIsRefreshingVisitedVenue(true),
    });
  const { mutateAsync: createQualityNoRating } = useCreateRating(
    "QualityRating",
    id,
    { silent: true, deferInvalidation: true },
  );
  const { mutateAsync: createCostNoRating } = useCreateRating(
    "CostRating",
    id,
    {
      silent: true,
      deferInvalidation: true,
    },
  );
  const { mutateAsync: createVibeNoRating } = useCreateRating(
    "VibeRating",
    id,
    {
      silent: true,
      deferInvalidation: true,
    },
  );
  const [noRatingVenueId, setNoRatingVenueId] = useState<string | null>(null);

  const refreshRatings = async (groupVenueId: string) => {
    setRefreshingRatingsCount((count) => count + 1);
    try {
      await invalidateRatingQueries(id, groupVenueId);
    } catch {
      showToast("Couldn't refresh venue ratings. Please try again.", "danger");
    } finally {
      setRefreshingRatingsCount((count) => Math.max(0, count - 1));
    }
  };

  const completeRatingsUpdate = (groupVenueId: string) => {
    notifyRatingsSaved();
    markJustRated(groupVenueId);
    refreshRatings(groupVenueId);
  };

  const markDidNotGo = (venue: GroupVenueResult) => {
    if (
      !venue.visited ||
      venue.myQualityRated ||
      venue.myCostRated ||
      venue.myVibeRated
    ) {
      return;
    }

    setNoRatingVenueId(venue.groupVenueId);
    noRatingSave.save(
      async () => {
        await Promise.all([
          createQualityNoRating({
            groupVenueId: venue.groupVenueId,
            optionId: null,
          }),
          createCostNoRating({
            groupVenueId: venue.groupVenueId,
            optionId: null,
          }),
          createVibeNoRating({
            groupVenueId: venue.groupVenueId,
            optionId: null,
          }),
        ]);
        notifyRatingsSaved();
      },
      () => {
        void refreshRatings(venue.groupVenueId).finally(() => {
          setNoRatingVenueId(null);
          noRatingSave.reset();
        });
      },
    );
  };

  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
  if (prevIsMobile !== isMobile) {
    setPrevIsMobile(isMobile);
    setDetailsVenue(null);
    setRatingsVenue(null);
  }

  const {
    columns,
    hasUserLocation,
    searchText,
    onSearchTextChange,
    isSearching,
    searchResults,
    isSearchLoading,
    isSearchError,
    isFetchingNextSearchPage,
    isFetchNextSearchPageError,
    fetchNextSearchPage,
    hasNextSearchPage,
    searchSentinelRef,
    venues,
    isVenuesLoading,
    isVenuesPending,
    isVenuesError,
    isFetchingNextVenuesPage,
    isFetchNextVenuesPageError,
    fetchNextVenuesPage,
    hasNextVenuesPage,
    venueSentinelRef,
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
  const { data: venueTypeOptionData, isSuccess: hasLoadedVenueTypeOptions } =
    useGetOptionsForGroup("VenueTypeOption", id);
  const { data: foodTypeOptionData, isSuccess: hasLoadedFoodTypeOptions } =
    useGetOptionsForGroup("FoodTypeOption", id);
  const qualityOptions = qualityOptionData?.options ?? [];
  const costOptions = costOptionData?.options ?? [];
  const vibeOptions = vibeOptionData?.options ?? [];
  const useDefaultVenueTypeIcons =
    hasLoadedVenueTypeOptions &&
    !(venueTypeOptionData?.options ?? []).some(
      (option) => option.groupId === id,
    );
  const venueTypeOptions = venueTypeOptionData?.options ?? [];
  const foodTypeOptions = foodTypeOptionData?.options ?? [];
  const canResolveVenueTypes =
    hasLoadedVenueTypeOptions && hasLoadedFoodTypeOptions;

  const markVisited = (venue: GroupVenueResult) => {
    if (venue.visited || isUpdatingGroupVenue || !canResolveVenueTypes) return;

    const venueTypeOptionId = optionIdForLabel(
      venueTypeOptions,
      venue.venueType,
    );
    const foodTypeOptionId = optionIdForLabel(foodTypeOptions, venue.foodType);
    if (
      (venue.venueType && !venueTypeOptionId) ||
      (venue.foodType && !foodTypeOptionId)
    ) {
      showToast(
        "Couldn't preserve the venue data. Please try again.",
        "danger",
      );
      return;
    }

    updateGroupVenue(
      {
        groupVenueId: venue.groupVenueId,
        request: {
          venueName: venue.venueName,
          visited: true,
          visitedOn: todayDateInputValue(),
          venueTypeOptionId,
          foodTypeOptionId,
          googlePlaceId: venue.googlePlaceId,
          formattedAddress: venue.formattedAddress,
          latitude: venue.latitude,
          longitude: venue.longitude,
        },
      },
      {
        onSettled: () => setIsRefreshingVisitedVenue(false),
      },
    );
  };

  return (
    <div
      className="manage-venues-page"
      aria-busy={isUpdatingGroupVenue || refreshingRatingsCount > 0}
    >
      <Modal
        show={isUpdatingGroupVenue}
        backdrop="static"
        keyboard={false}
        centered
        aria-labelledby="venue-update-saving-label"
      >
        <Modal.Body
          className="d-flex align-items-center justify-content-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Spinner animation="border" size="sm" aria-hidden="true" />
          <span id="venue-update-saving-label">
            {isRefreshingVisitedVenue
              ? "Refreshing venues..."
              : "Saving venue..."}
          </span>
        </Modal.Body>
      </Modal>

      <h2 className="mb-1 lead">Create & Rate</h2>
      <p className="text-muted small mb-3">
        Add, edit and rate the venues for this group. You can add your ratings
        once a venue has been visited.
      </p>

      <div className="d-grid mx-auto mb-3">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Add Venue
        </Button>
      </div>
      {refreshingRatingsCount > 0 && (
        <div
          className="alert alert-info d-flex align-items-center gap-2 py-2"
          role="status"
          aria-live="polite"
        >
          <Spinner size="sm" aria-hidden="true" />
          <span>Refreshing venue ratings…</span>
        </div>
      )}

      <CreateGroupVenueModal
        show={showCreateModal}
        groupId={id}
        onClose={() => setShowCreateModal(false)}
      />

      {!isMobile && (
        <GroupVenueModal
          groupId={id}
          venue={detailsVenue}
          onClose={() => setDetailsVenue(null)}
          onRatingsSaved={completeRatingsUpdate}
          onRefreshRatings={refreshRatings}
          isRefreshingRatings={refreshingRatingsCount > 0}
        />
      )}
      {isMobile && (
        <>
          <VenueDetailsModal
            groupId={id}
            venue={detailsVenue}
            onClose={() => setDetailsVenue(null)}
          />
          <VenueRatingsModal
            groupId={id}
            venue={ratingsVenue}
            onClose={() => setRatingsVenue(null)}
            onRatingsSaved={completeRatingsUpdate}
            onRefreshRatings={refreshRatings}
          />
        </>
      )}

      {showSearch && (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="venuesSearch">
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
                  <GroupVenueRow
                    key={x.groupVenueId}
                    venue={x}
                    qualityOptions={qualityOptions}
                    costOptions={costOptions}
                    vibeOptions={vibeOptions}
                    showDistance={hasUserLocation}
                    onSelect={setDetailsVenue}
                    justRated={x.groupVenueId === justRatedId}
                  />
                ))}
              </tbody>
            </Table>
          </TableScrollContainer>

          <div className="d-md-none venue-card-list border-top">
            {searchResults.map((x: GroupVenueResult) => (
              <VenueCard
                key={x.groupVenueId}
                venue={x}
                qualityOptions={qualityOptions}
                costOptions={costOptions}
                vibeOptions={vibeOptions}
                onEditDetails={setDetailsVenue}
                onEditRatings={setRatingsVenue}
                onMarkVisited={markVisited}
                markVisitedDisabled={
                  isUpdatingGroupVenue || !canResolveVenueTypes
                }
                onMarkDidNotGo={markDidNotGo}
                noRatingStatus={
                  noRatingVenueId === x.groupVenueId
                    ? noRatingSave.status
                    : "idle"
                }
                noRatingDisabled={noRatingSave.isBusy}
                useDefaultVenueTypeIcons={useDefaultVenueTypeIcons}
                justRated={x.groupVenueId === justRatedId}
              />
            ))}
          </div>

          <InfiniteScrollLoader
            sentinelRef={searchSentinelRef}
            hasNextPage={hasNextSearchPage}
            isFetchingNextPage={isFetchingNextSearchPage}
            isFetchNextPageError={isFetchNextSearchPageError}
            onRetry={() => fetchNextSearchPage()}
          />
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
                      <GroupVenueSkeletonRow
                        key={index}
                        showDistance={hasUserLocation}
                      />
                    ))
                  : venues.map((x: GroupVenueResult) => (
                      <GroupVenueRow
                        key={x.groupVenueId}
                        venue={x}
                        qualityOptions={qualityOptions}
                        costOptions={costOptions}
                        vibeOptions={vibeOptions}
                        showDistance={hasUserLocation}
                        onSelect={setDetailsVenue}
                        justRated={x.groupVenueId === justRatedId}
                      />
                    ))}
              </tbody>
            </Table>
          </TableScrollContainer>

          <div className="d-md-none">
            {isVenuesPending ? (
              <MobileSortSkeleton />
            ) : (
              <MobileSortControl
                id="venuesMobileSort"
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
            )}
          </div>

          <div className="d-md-none venue-card-list border-top">
            {isVenuesPending
              ? Array.from({ length: skeletonRowCount }, (_, index) => (
                  <div key={index} className="venue-card venue-card-skeleton" />
                ))
              : venues.map((x: GroupVenueResult) => (
                  <VenueCard
                    key={x.groupVenueId}
                    venue={x}
                    qualityOptions={qualityOptions}
                    costOptions={costOptions}
                    vibeOptions={vibeOptions}
                    onEditDetails={setDetailsVenue}
                    onEditRatings={setRatingsVenue}
                    onMarkVisited={markVisited}
                    markVisitedDisabled={
                      isUpdatingGroupVenue || !canResolveVenueTypes
                    }
                    onMarkDidNotGo={markDidNotGo}
                    noRatingStatus={
                      noRatingVenueId === x.groupVenueId
                        ? noRatingSave.status
                        : "idle"
                    }
                    noRatingDisabled={noRatingSave.isBusy}
                    useDefaultVenueTypeIcons={useDefaultVenueTypeIcons}
                    justRated={x.groupVenueId === justRatedId}
                  />
                ))}
          </div>

          <InfiniteScrollLoader
            sentinelRef={venueSentinelRef}
            hasNextPage={hasNextVenuesPage}
            isFetchingNextPage={isFetchingNextVenuesPage}
            isFetchNextPageError={isFetchNextVenuesPageError}
            onRetry={() => fetchNextVenuesPage()}
          />
        </>
      )}
    </div>
  );
};

export default GroupVenuesPage;
