import React, { useState, useEffect } from 'react';
import { MultiSelect, Tree, Checkbox, Group, Box, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppStore } from '../../modalStore';
import { type Layout as DocLayout } from '../../types/docStateTypes';
import { type Layout } from '../../types/layoutConfigTypes';

interface LayoutMultiSelectProps {
  value: Layout[];
  onChange: (updatedLayouts: Layout[]) => void;
}

// Helper function to convert document layouts to tree data format
const buildTreeData = (documentLayouts: DocLayout[], selectedLayoutIds: string[]) => {
  // First, create a map of all layouts by ID for quick lookup
  const layoutsMap = new Map();
  documentLayouts.forEach(layout => {
    layoutsMap.set(layout.id, {
      value: layout.id,
      label: layout.name,
      children: [],
    });
  });
  
  // Then build the tree structure
  const rootNodes: any[] = [];
  
  documentLayouts.forEach(layout => {
    const node = layoutsMap.get(layout.id);
    
    if (layout.parentId && layoutsMap.has(layout.parentId)) {
      // This is a child node, add it to its parent's children
      const parentNode = layoutsMap.get(layout.parentId);
      parentNode.children.push(node);
    } else {
      // This is a root node
      rootNodes.push(node);
    }
  });
  
  return rootNodes;
};

export const LayoutMultiSelect: React.FC<LayoutMultiSelectProps> = ({
  value,
  onChange,
}) => {
  const { documentState } = useAppStore();
  const [opened, { open, close }] = useDisclosure(false);
  
  // Extract layout IDs from the Layout array
  const selectedLayoutIds = value.map(layout => layout.name);
  
  // Convert selected layout IDs to data for MultiSelect
  const multiSelectData = documentState.layouts.map(layout => ({
    value: layout.id,
    label: layout.name
  }));
  
  // Convert document layouts to tree data
  const treeData = buildTreeData(documentState.layouts, selectedLayoutIds);
  
  // Handle tree node check/uncheck
  const handleTreeChange = (checkedValues: string[]) => {
    // Convert checked values back to Layout array
    const newLayouts: Layout[] = checkedValues.map(id => {
      // Find the layout in documentState to get the name
      const docLayout = documentState.layouts.find(l => l.id === id);
      const layoutName = docLayout ? docLayout.id : id;
      
      // Check if this layout already exists in the value array
      const existingLayout = value.find(l => l.name === layoutName);
      if (existingLayout) {
        return existingLayout;
      }
      
      // Create a new layout object
      return {
        name: layoutName,
        includeChildren: false
      };
    });
    
    onChange(newLayouts);
  };
  
  // Handle MultiSelect change
  const handleMultiSelectChange = (selectedValues: string[]) => {
    // Convert selected values back to Layout array
    const newLayouts: Layout[] = selectedValues.map(id => {
      // Find the layout in documentState to get the name
      const docLayout = documentState.layouts.find(l => l.id === id);
      const layoutName = docLayout ? docLayout.id : id;
      
      // Check if this layout already exists in the value array
      const existingLayout = value.find(l => l.name === layoutName);
      if (existingLayout) {
        return existingLayout;
      }
      
      // Create a new layout object
      return {
        name: layoutName,
        includeChildren: false
      };
    });
    
    onChange(newLayouts);
  };
  
  // Render tree node with checkbox
  const renderTreeNode = ({ node, tree }: any) => {
    // Check if this node's ID is in the selected layouts
    const checked = value.some(layout => layout.name === node.value);
    
    return (
      <Group gap="xs">
        <Checkbox
          checked={checked}
          onChange={() => {
            if (checked) {
              // Remove this layout from the selected layouts
              const newSelectedIds = value
                .filter(layout => layout.name !== node.value)
                .map(layout => layout.name);
              handleTreeChange(newSelectedIds);
            } else {
              // Add this layout to the selected layouts
              const newSelectedIds = [...value.map(layout => layout.name), node.value];
              handleTreeChange(newSelectedIds);
            }
          }}
        />
        <span>{node.label}</span>
      </Group>
    );
  };
  
  return (
    <Popover
      opened={opened}
      onClose={close}
      position="bottom"
      width="target"
      withArrow
    >
      <Popover.Target>
        <div onClick={open}>
          <MultiSelect
            data={multiSelectData}
            value={value.map(layout => layout.name)}
            onChange={handleMultiSelectChange}
            label="Layouts"
            placeholder="Select layouts"
            searchable
            clearable
            readOnly={opened}
          />
        </div>
      </Popover.Target>
      
      <Popover.Dropdown>
        <Box maw={400} h={300} style={{ overflowY: 'auto' }}>
          <Tree
            data={treeData}
            renderNode={renderTreeNode}
            expandOnClick={false}
          />
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};