export { createServiceInbox } from "./inbox.js";
export { processMessage } from "./runner.js";
export {
  putMessage,
  getMessage,
  updateMessageStatus,
  putTask,
  getTask,
  updateTask,
  queryMessagesByDepartment,
  queryTasksByDepartment,
  queryByTrace,
  putNote,
  getNote,
  updateNote,
  queryNotesByUser,
  queryAllNotes,
} from "./db.js";
export type { QueryOptions, TaskQueryOptions } from "./db.js";
export { sendMessage } from "./sqs.js";
export type { SendMessageOptions } from "./sqs.js";
export { discoverService, listServices } from "./discovery.js";
export type {
  ServiceMessage,
  Attachment,
  Task,
  Note,
  AutomationMode,
  ServiceConfig,
} from "./types.js";
