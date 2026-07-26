import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { OptionController } from "../api/controllerHooks/useOptionController";
import type { RatingController } from "../api/controllerHooks/useRatingController";

export type GroupChangeEntity =
  | "Group"
  | "Members"
  | "Venues"
  | "Ratings"
  | "Options";

export interface GroupChangedEvent {
  groupId: string;
  entity: GroupChangeEntity;
}

export type UserChangeEntity = "Friends";

export interface UserChangedEvent {
  userId: string;
  entity: UserChangeEntity;
}

const ratingControllers: Record<RatingController, true> = {
  CostRating: true,
  QualityRating: true,
  VibeRating: true,
};

const optionControllers: Record<OptionController, true> = {
  CostOption: true,
  FoodTypeOption: true,
  QualityOption: true,
  VibeOption: true,
  VenueTypeOption: true,
};

const ratingKeys = (groupId: string): QueryKey[] =>
  Object.keys(ratingControllers).map((controller) => [controller, groupId]);

const optionKeys = (groupId: string): QueryKey[] =>
  Object.keys(optionControllers).map((controller) => [controller, groupId]);

const keysForEntity = (
  groupId: string,
  entity: GroupChangeEntity,
): QueryKey[] => {
  switch (entity) {
    case "Group":
      return [["groups", groupId], ["userGroups"]];

    case "Members":
      return [["groups", groupId, "members"], ["userGroups"]];

    case "Venues":
      return [["groups", groupId, "venues"], ["userGroups"]];

    case "Ratings":
      return [
        ...ratingKeys(groupId),
        ["groups", groupId, "venues"],
        ["userGroups"],
      ];

    case "Options":
      return [
        ...optionKeys(groupId),
        ...ratingKeys(groupId),
        ["groups", groupId, "venues"],
        ["userGroups"],
      ];
  }
};

export const applyGroupChange = (
  queryClient: QueryClient,
  { groupId, entity }: GroupChangedEvent,
) => {
  for (const queryKey of keysForEntity(groupId, entity)) {
    queryClient.invalidateQueries({ queryKey });
  }
};

const keysForUserEntity = (entity: UserChangeEntity): QueryKey[] => {
  switch (entity) {
    case "Friends":
      return [["friends"], ["currentUser"]];
  }
};

export const applyUserChange = (
  queryClient: QueryClient,
  { entity }: UserChangedEvent,
) => {
  for (const queryKey of keysForUserEntity(entity)) {
    queryClient.invalidateQueries({ queryKey });
  }
};

const externallyBilledKeys = ["googlePlaceDetails"];

export const invalidateAfterReconnect = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    predicate: (query) =>
      !externallyBilledKeys.includes(query.queryKey[0] as string),
  });
};
