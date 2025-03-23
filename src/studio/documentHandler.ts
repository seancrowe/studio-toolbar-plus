import { Result } from "typescript-result";
import type { LayoutMap } from "../types/layoutConfigTypes.ts";
import {
  getPrivateData,
  setPrivateData,
  getAllLayouts,
} from "./layoutHandler.ts";
import { getAllVariables } from "./variableHandler.ts";
import type {
  PrivateData,
  default as SDKType,
} from "@chili-publish/studio-sdk";
import {
  createEmptyEnvelope,
  type ToolbarEnvelope,
} from "../types/toolbarEnvelope.ts";
import { json } from "typia";
import type {
  Doc,
  Layout,
  Variable,
  TextImageVariable,
  ListVariable,
  BooleanVariable,
} from "../types/docStateTypes.ts";

declare global {
  interface Window {
    SDK: SDKType;
  }
}

export async function loadLayoutImageMapFromDoc(): Promise<
  Result<LayoutMap[], never> | Result<never, Error>
> {
  console.log("GET PRIVATE DAT");
  const dataResult = await getPrivateData({
    id: "0",
    studio: window.SDK,
  });

  if (dataResult.isOk()) {
    console.log("PRIVATE DATA OGTTEN");
    const data = dataResult.value as PrivateData;

    console.log("DATA BEFROE", data);
    if (data.toolbar != null) {
      const toolbarResult = await Result.try(() => JSON.parse(data.toolbar));
      if (toolbarResult.isOk()) {
        return Result.ok((toolbarResult.value as ToolbarEnvelope).layoutMaps);
      }

      return toolbarResult as Result<never, Error>;
    } else {
      const newData = {...data, "toolbar": JSON.stringify(createEmptyEnvelope(), null, 0)};
      console.log("DATA AFTER", newData);
      const setDataResult = await setPrivateData({
        studio: window.SDK,
        id: "0",
        privateData: data,
      });
      if (setDataResult.isOk()) {
        return Result.ok([]);
      }

      return setDataResult as Result<never, Error>;
    }
  }

  return dataResult as Result<never, Error>;
}

export async function saveLayoutImageMapToDoc(layoutMaps: LayoutMap[]) {
  const dataResult = await getPrivateData({
    id: "0",
    studio: window.SDK,
  });

  if (dataResult.isOk()) {
    const data = dataResult.value as PrivateData;
    if (data.toolbar != null) {
      const toolbarResult = await Result.try(() => JSON.parse(data.toolbar));
      if (toolbarResult.isOk()) {
        const toolbar = toolbarResult.value as ToolbarEnvelope;
        toolbar.layoutMaps = layoutMaps;
        const stringifyResult = Result.try(() =>
          JSON.stringify(toolbar, null, 0),
        );
        if (stringifyResult.isOk()) {
          data.toolbar = stringifyResult.value as string;
          const setDataResult = await setPrivateData({
            studio: window.SDK,
            id: "0",
            privateData: data,
          });
          if (setDataResult.isOk()) {
            return Result.ok();
          }

          return setDataResult;
        }
        return stringifyResult;
      }
      return toolbarResult;
    }

    return Result.error(new Error("data.toolbar is null"));
  }

  return dataResult;
}

export async function loadDocFromDoc(): Promise<
  Result<Doc, never> | Result<never, Error>
> {
  // Get all layouts from the SDK
  const layoutsResult = await getAllLayouts(window.SDK);
  if (!layoutsResult.isOk()) {
    return layoutsResult as Result<never, Error>;
  }

  // Get all variables from the SDK
  const variablesResult = await getAllVariables(window.SDK);
  if (!variablesResult.isOk()) {
    return variablesResult as Result<never, Error>;
  }

  // Transform layouts to match the Layout type
  const layouts: Layout[] = layoutsResult.value.map((layout: any) => ({
    name: layout.name || "",
    id: layout.id || "",
    parentId: layout.parentId,
  }));

  // Transform variables to match the Variable type
  const variables: Variable[] = variablesResult.value.map((variable: any) => {
    const baseVariable = {
      id: variable.id || "",
      name: variable.name || "",
      isVisiblie: variable.isVisible ?? false,
    };

    switch (variable.type) {
      case "image":
      case "shortText":
        return {
          ...baseVariable,
          type: variable.type as "image" | "shortText",
          value: String(variable.value || ""),
        } as TextImageVariable;
      case "list":
        return {
          ...baseVariable,
          type: "list",
          value: String(variable.value || ""),
          items: Array.isArray(variable.items)
            ? variable.items.map((item: any) => ({
                value: String(item.value || ""),
                displayValue: item.displayValue,
              }))
            : [],
        } as ListVariable;
      case "boolean":
        return {
          ...baseVariable,
          type: "boolean",
          value: Boolean(variable.value),
        } as BooleanVariable;
      default:
        // Default to text variable for unknown types
        return {
          ...baseVariable,
          type: "shortText",
          value: String(variable.value || ""),
        } as TextImageVariable;
    }
  });

  // Return the Doc object
  return Result.ok({
    layouts,
    variables,
  });
}
