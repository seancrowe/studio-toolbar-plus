import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { ConfigModal } from "./components/Old/ConfigModal.tsx";
import { appStore } from "./modalStore";
import { Toolbar, ToolbarHover } from "./components/Old/Toolbar.tsx";
import { ToolbarButton } from "./components/Old/ToolbarButton.tsx";
import type { default as SDKType } from "@chili-publish/studio-sdk";
import { LayoutImageMappingModal } from "./components/LayoutMappingModal/LayoutModal.tsx";
import "@mantine/core/styles.css";
import { MantineProvider, MultiSelect } from "@mantine/core";
import { LayoutMultiSelect } from "./components/LayoutMappingModal/LayoutMultiSelect.tsx";

declare global {
  interface Window {
    rootInstance?: Root;
    toolbarInstance?: Root;
    SDK: SDKType;
    customToolbar: () => void;
  }
}

interface ModalAPI {
  show: () => void;
  hide: () => void;
  exportCSV: () => void;
}

// Initialize the toolbar function hi
function initToolbar(): void {
  // Create toolbar container if it doesn't exist
  if (!window.toolbarInstance) {
    const toolbarContainer = document.createElement("div");
    toolbarContainer.id = "custom-toolbar-root";

    // Insert at the beginning of body
    if (document.body.firstChild) {
      document.body.insertBefore(toolbarContainer, document.body.firstChild);
    } else {
      document.body.appendChild(toolbarContainer);
    }

    // Create root for the toolbar
    window.toolbarInstance = createRoot(toolbarContainer);

    // Render the toolbar component!
    window.toolbarInstance.render(
      <React.StrictMode>
        <ToolbarHover />
        <Toolbar>
          <ToolbarButton
            name="Variable Config"
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
                strokeWidth="2"
              >
                <path d="M15 8h.01"></path>
                <path d="M12 21h-6a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6"></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.993 3.993"></path>
                <path d="M14 14l1 -1c.47 -.452 .995 -.675 1.52 -.67"></path>
                <path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5"></path>
              </svg>
            }
            onClick={() => {
              // useModalStore.getState().showModal();
              // useModalStore.getState().disableToolbar();
            }}
          />
        </Toolbar>
      </React.StrictMode>,
    );
  }
}

//@ts-ignore
window.test = () => console.log(appStore.getState());

// Define the exportCSV function z
const handleExportCSV = () => {
  console.log("Exporting CSV...");
  // Implementation will come later
};

function renderConfigModal(): void {
  // Create our modal root if it doesn't exist
  if (!window.rootInstance) {
    // Create div on body and use in it in the createRoot
    const modalContainer = document.createElement("div");
    modalContainer.id = "config-modal-root";
    document.body.appendChild(modalContainer);

    window.rootInstance = createRoot(modalContainer);
  }

  window.rootInstance.render(
    <React.StrictMode>
      <LayoutImageMappingModal onExportCSV={() => console.log("Look")} />
    </React.StrictMode>,
  );
}

setTimeout(() => {
  initToolbar();
  renderConfigModal();
}, 11000);
