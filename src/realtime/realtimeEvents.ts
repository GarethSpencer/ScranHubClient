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

const BURST_WINDOW_MS = 200;

const keysForUserEntity = (entity: UserChangeEntity): QueryKey[] => {
  switch (entity) {
    case "Friends":
      return [["friends"], ["currentUser"]];
  }
};

export const createRealtimeInvalidator = (queryClient: QueryClient) => {
  const pendingKeys = new Map<string, QueryKey>();
  let timer: number | null = null;

  const flush = () => {
    timer = null;
    const queryKeys = [...pendingKeys.values()];
    pendingKeys.clear();

    for (const queryKey of queryKeys) {
      //don't restart a refetch that our own mutation already started
      queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false });
    }
  };

  const enqueue = (queryKeys: QueryKey[]) => {
    for (const queryKey of queryKeys) {
      pendingKeys.set(JSON.stringify(queryKey), queryKey);
    }

    timer ??= window.setTimeout(flush, BURST_WINDOW_MS);
  };

  return {
    groupChanged: ({ groupId, entity }: GroupChangedEvent) =>
      enqueue(keysForEntity(groupId, entity)),

    userChanged: ({ entity }: UserChangedEvent) =>
      enqueue(keysForUserEntity(entity)),

    dispose: () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      pendingKeys.clear();
    },
  };
};

const externallyBilledKeys = ["googlePlaceDetails"];

export const invalidateAfterReconnect = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    predicate: (query) =>
      !externallyBilledKeys.includes(query.queryKey[0] as string),
  });
};
