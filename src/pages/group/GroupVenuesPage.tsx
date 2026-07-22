import { useParams } from "react-router-dom";
import { MAX_VENUE_NAME_LENGTH } from "../../constants/validation";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useGetOptionsForGroup } from "../../api/controllerHooks/useOptionController";
import TableStatus from "../../components/common/TableStatus";
import TableScrollContainer from "../../components/common/TableScrollContainer";
import TablePagination from "../../components/common/TablePagination";
import GroupVenueRow from "../../components/GroupVenueRow";
import GroupVenueSkeletonRow from "../../components/GroupVenueSkeletonRow";
import CreateGroupVenueModal from "../../components/CreateGroupVenueModal";
import GroupVenueModal from "../../components/GroupVenueModal";
import VenueCard from "../../components/venue/VenueCard";
import VenueDetailsModal from "../../components/venue/VenueDetailsModal";
import VenueRatingsModal from "../../components/venue/VenueRatingsModal";
import MobileSortControl from "../../components/venue/MobileSortControl";
import TablePageSizeSelect from "../../components/common/TablePageSizeSelect";
import useGroupVenueListing, {
  type VenueListingColumn,
} from "../../hooks/useGroupVenueListing";
import useIsMobile from "../../hooks/useIsMobile";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";
import { SEARCH_PAGE_SIZE } from "../../constants/pagination";

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

  return (
    <>
      <h2 className="mb-1 lead">Manage Venues</h2>
      <p className="text-muted small mb-3">
        Add, edit and rate the venues for this group. You can add your ratings
        once a venue has been visited.
      </p>

      <div className="d-grid mx-auto mb-3">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Add Venue
        </Button>
      </div>

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
                      />
                    ))}
              </tbody>
            </Table>
          </TableScrollContainer>

          {!isVenuesPending && (
            <div className="d-md-none">
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
            </div>
          )}

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
              id="venuesPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GroupVenuesPage;
