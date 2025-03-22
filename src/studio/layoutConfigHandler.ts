import { Result } from "typescript-result";
import type { LayoutConfig } from "../types/layoutConfigTypes";

export async function loadConfigFromDoc(): Promise<
  Result<LayoutConfig[], never>
> {
  return Result.ok([
    {
      id: "1234",
      layoutIds: ["6"],
      variables: [],
    },
  ]);
}
