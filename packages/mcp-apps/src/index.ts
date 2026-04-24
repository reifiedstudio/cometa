export { viewMap, getView } from "./views/index.js";

/**
 * Map of tool names → their ui:// resource URIs.
 * The gateway uses this to inject _meta.ui into tool descriptions.
 */
export const toolUiMap: Record<string, string> = {
  create_note: "ui://cometa/cometa-card.html",
  create_branded_document: "ui://cometa/cometa-card.html",
  convert_to_pdf: "ui://cometa/cometa-card.html",
};

/**
 * Map of ui:// URIs → view names (keys into viewMap).
 * The gateway uses this to resolve resources/read requests.
 */
export const uriToViewMap: Record<string, string> = {
  "ui://cometa/cometa-card.html": "cometa-card",
};
