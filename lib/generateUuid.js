import crypto from "crypto";
import mysql from "mysql2";
import { executeQuery } from "./db";

/**
 * Generates a unique 8-character UUID for a given table and column.
 * @param {string} table - Table name where UUID uniqueness should be checked
 * @param {string} column - Column name where UUID uniqueness should be enforced
 * @returns {Promise<string>} A unique 8-character UUID
 */
export async function generateUniqueShortUUID(table, column) {
  let uuid;
  let exists = true;

  try {
    do {
      uuid = crypto.randomBytes(4).toString("hex"); // 8 characters

      const rawQuery = mysql.format(
        `SELECT \`${column}\` FROM \`${table}\` WHERE \`${column}\` = ? LIMIT 1`,
        [uuid]
      );

      const rows = await executeQuery({ query: rawQuery }); // Correct destructure

      exists = rows.length > 0;
    } while (exists);

    return uuid;
  } catch (error) {
    console.error("Error generating unique UUID:", error);
    throw new Error("Failed to generate unique UUID");
  }
}
