export { documentCardView, viewMap, getView } from "./views/index.js";

/**
 * Map of tool names → their ui:// resource URIs.
 * The gateway uses this to inject _meta.ui into tool descriptions.
 */
export const toolUiMap: Record<string, string> = {
  create_branded_document: "ui://cometa/document-card.html",
  convert_to_pdf: "ui://cometa/document-card.html",
};

/**
 * Map of ui:// URIs → view names (keys into viewMap).
 * The gateway uses this to resolve resources/read requests.
 */
export const uriToViewMap: Record<string, string> = {
  "ui://cometa/document-card.html": "document-card",
};
