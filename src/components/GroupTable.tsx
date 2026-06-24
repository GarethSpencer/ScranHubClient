import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import TableStatus from "./common/TableStatus";
import type GroupResult from "../models/results/GroupResult";

interface Props {
  heading: string;
  headingClassName?: string;
  helperText?: string;
  groups: GroupResult[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  showActions?: boolean;
  isLeaving?: boolean;
  isActing?: (groupId: string, action: string) => boolean;
  onLeaveGroup?: (groupId: string) => void;
}

const GroupTable = ({
  heading,
  headingClassName = "",
  helperText,
  groups,
  isLoading,
  isError,
  emptyText,
  showActions = false,
  isLeaving = false,
  isActing,
  onLeaveGroup,
}: Props) => {
  return (
    <>
      <h2 className={`mb-1 lead ${headingClassName}`}>{heading}</h2>
      {helperText && <p className="text-muted small mb-3">{helperText}</p>}
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={groups.length === 0}
        loadingText="Loading your groups..."
        errorText="Couldn't load your groups. Please try again."
        emptyText={emptyText}
      >
        <Table
          striped="columns"
          className="align-middle text-center border-top"
        >
          <thead>
            <tr>
              <th className="w-50">Group Name</th>
              <th className={showActions ? "w-25" : "w-50"}>Created By</th>
              {showActions && <th className="w-25">Action</th>}
            </tr>
          </thead>
          <tbody>
            {groups.map((x: GroupResult) => (
              <tr key={x.groupId}>
                <td className="w-50 text-start text-break">
                  <Link to={`/group/${x.groupId}`}>{x.groupName}</Link>
                </td>
                <td
                  className={`${showActions ? "w-25" : "w-50"} text-start text-break`}
                >
                  {x.displayName}
                </td>
                {showActions && (
                  <td className="w-25">
                    <Button
                      variant="danger"
                      onClick={() => onLeaveGroup?.(x.groupId)}
                      disabled={isLeaving}
                    >
                      {isActing?.(x.groupId, "delete") ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Leave Group"
                      )}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableStatus>
    </>
  );
};

export default GroupTable;
