/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activities from "../activities.js";
import type * as admin from "../admin.js";
import type * as agriculturalPlots from "../agriculturalPlots.js";
import type * as announcements from "../announcements.js";
import type * as auth from "../auth.js";
import type * as barangays from "../barangays.js";
import type * as chats from "../chats.js";
import type * as crops from "../crops.js";
import type * as http from "../http.js";
import type * as mapMarkers from "../mapMarkers.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  admin: typeof admin;
  agriculturalPlots: typeof agriculturalPlots;
  announcements: typeof announcements;
  auth: typeof auth;
  barangays: typeof barangays;
  chats: typeof chats;
  crops: typeof crops;
  http: typeof http;
  mapMarkers: typeof mapMarkers;
  seed: typeof seed;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
