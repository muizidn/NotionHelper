import LocalImageRepository, { DbImage } from "./local";

const repo = new LocalImageRepository("NotionHelper", "NotionImage")

export type { DbImage };
export default repo;