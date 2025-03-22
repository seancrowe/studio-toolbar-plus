import { Result } from "typescript-result";
import type { LayoutMap } from "../types/layoutConfigTypes";

export async function loadConfigFromDoc(): Promise<Result<LayoutMap[], never>> {
  return Result.ok([
    {
      id: "1234",
      layoutIds: ["6"],
      variables: [],
    },
  ]);
}
