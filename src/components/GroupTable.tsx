import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableStatus from "./common/TableStatus";
import ConfirmModal from "./common/ConfirmModal";
import type GroupResult from "../models/results/GroupResult";

interface Props {
  heading: string;
  headingClassName?: string;
  helperText?: string;
  groups: GroupResult[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  showCreatedBy?: boolean;
  showActions?: boolean;
  isLeaving?: boolean;
  isActing?: (groupId: string, action: string) => boolean;
  onLeaveGroup?: (groupId: string, onSuccess: () => void) => void;
}

const GroupTable = ({
  heading,
  headingClassName = "",
  helperText,
  groups,
  isLoading,
  isError,
  emptyText,
  showCreatedBy = true,
  showActions = false,
  isLeaving = false,
  isActing,
  onLeaveGroup,
}: Props) => {
  const [groupToLeave, setGroupToLeave] = useState<GroupResult | null>(null);

  const onConfirmLeaveGroup = () => {
    if (groupToLeave) {
      onLeaveGroup?.(groupToLeave.groupId, () => setGroupToLeave(null));
    }
  };

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
              <th>Group Name</th>
              {showCreatedBy && <th>Created By</th>}
              {showActions && (
                <th className="text-nowrap" style={{ width: "1%" }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {groups.map((x: GroupResult) => (
              <tr key={x.groupId}>
                <td className="text-start text-break">
                  <Link to={`/group/${x.groupId}`}>{x.groupName}</Link>
                </td>
                {showCreatedBy && (
                  <td className="text-start text-break">{x.displayName}</td>
                )}
                {showActions && (
                  <td className="text-nowrap" style={{ width: "1%" }}>
                    <OverlayTrigger overlay={<Tooltip>Leave group</Tooltip>}>
                      <span className="d-inline-block">
                        <Button
                          variant="danger"
                          className="icon-btn"
                          onClick={() => setGroupToLeave(x)}
                          disabled={isLeaving}
                          aria-label={`Leave ${x.groupName}`}
                        >
                          <FaSignOutAlt />
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableStatus>

      {showActions && (
        <ConfirmModal
          show={groupToLeave !== null}
          title="Leave Group"
          body={
            <p className="mb-0">
              Are you sure you want to leave{" "}
              <strong>{groupToLeave?.groupName}</strong>?
            </p>
          }
          confirmLabel="Leave Group"
          pendingLabel="Leaving..."
          isPending={
            !!groupToLeave && !!isActing?.(groupToLeave.groupId, "delete")
          }
          onConfirm={onConfirmLeaveGroup}
          onCancel={() => setGroupToLeave(null)}
        />
      )}
    </>
  );
};

export default GroupTable;
