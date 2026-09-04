import { createDatabase, Database } from "@maides/database";
import { config } from "./config.js";

export const db: Database = createDatabase(config.DATABASE_URL);
