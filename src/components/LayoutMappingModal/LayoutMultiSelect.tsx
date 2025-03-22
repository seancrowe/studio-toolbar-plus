import { Group, MultiSelect } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { Drawer, Button } from "@mantine/core";
import type { LayoutMap } from "../../types/layoutConfigTypes.ts";
import type { Layout } from "../../types/docStateTypes.ts";
import { useAppStore, appStore } from "../../modalStore.ts";

type LayoutMultiSelectProps = {
  layoutConfig: LayoutMap;
  showButton: boolean;
  // onChange: (updatedLayouts: Layout[]) => void;
};

// Helper function to convert document layouts to tree data format
const buildTreeData = (
  documentLayouts: Layout[],
  selectedLayoutIds: string[],
) => {
  // First, create a map of all layouts by ID for quick lookup
  const layoutsMap = new Map();
  documentLayouts.forEach((layout) => {
    layoutsMap.set(layout.id, {
      value: layout.id,
      label: layout.name,
      children: [],
    });
  });
};

export const LayoutMultiSelect: React.FC<LayoutMultiSelectProps> = ({
  layoutConfig,
  showButton,
  // onChange
}) => {
  const { state, effects: events } = useAppStore();

  const handleMultiSelectChange = (updateLayoutIds: string[]) => {
    events.studio.layoutImageMapping.setLayoutIds({
      mapId: layoutConfig.id,
      layoutIds: updateLayoutIds,
    });
  };

  return (
    <Group>
      <MultiSelect
        data={state.studio.document.layouts.map((layout) => ({
          value: layout.id,
          label: layout.name,
        }))}
        value={
          state.studio.layoutImageMapping.find((lc) => lc.id == layoutConfig.id)
            ?.layoutIds
        }
        onChange={handleMultiSelectChange}
        placeholder="Select layouts"
        searchable
        clearable
        styles={{
          root: {
            width: showButton ? "80%" : "100%",
          },
        }}
      />

      {showButton && (
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="24"
            height="24"
            stroke-width="2"
          >
            <path d="M13 5h8"></path>
            <path d="M13 9h5"></path>
            <path d="M13 15h8"></path>
            <path d="M13 19h5"></path>
            <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
            <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
          </svg>
          <span style={{ marginLeft: "10px" }}>Open Selector</span>
        </Button>
      )}
    </Group>
  );
};

/** 
 *
    <MultiSelect
      data={documentState.layouts.map(layout => ({ value: layout.id, label: layout.name }))}
      value={layoutConfigs.find(lc => lc.id == layoutConfig.id)?.layoutIds}
      onChange={handleMultiSelectChange}
      label="Layouts"
      placeholder="Select layouts"
      searchable
      clearable
    />
 *
 * */
