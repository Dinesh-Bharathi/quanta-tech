import { executeQuery } from "@/lib/db";
import { generateUniqueShortUUID } from "@/lib/generateUuid";

export async function PUT(req, { params }) {
  const { id } = await params;
  const { name, description, permissions, status } = await req.json();

  const now = new Date().toISOString().split("T")[0];

  const result = await executeQuery({
    query: `UPDATE tbl_tent_config
     SET name = ?, description = ?, permissions = ?, status = ?, updated_at = ?
     WHERE tent_config_uuid = ?`,
    values: [name, description, JSON.stringify(permissions), status, now, id],
  });

  if (result.affectedRows === 0) {
    return Response.json({ error: "Role not found" }, { status: 404 });
  }

  return Response.json({ message: "Role updated" });
}

export async function DELETE(_, { params }) {
  const { id } = await params;

  const result = await executeQuery({
    query: "DELETE FROM tbl_tent_config WHERE tent_config_uuid = ?",
    values: [id],
  });

  if (result.affectedRows === 0) {
    return Response.json({ error: "Role not found" }, { status: 404 });
  }

  return Response.json({ message: "Role deleted" });
}

export async function GET(req, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  let query = "SELECT * FROM tbl_tent_config WHERE tent_uuid = ?";
  const values = [id];

  if (search) {
    query += " AND (name LIKE ? OR description LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    query += " AND status = ?";
    values.push(status === "active");
  }

  try {
    const rows = await executeQuery({ query, values });

    const parsedRows = rows.map(
      ({
        config_id,
        permissions,
        created_at,
        updated_at,
        status,
        ...rest
      }) => ({
        ...rest,
        permissions: parsePermissions(permissions),
        status: status ? "active" : "inactive",
        createdAt: created_at,
        updatedAt: updated_at,
      })
    );

    return Response.json({ data: parsedRows, total: parsedRows.length });
  } catch (error) {
    console.error("Error fetching tent configs:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function parsePermissions(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const { name, description, permissions, status = true } = body;

    const tent_config_uuid = await generateUniqueShortUUID(
      "tbl_tent_config",
      "tent_config_uuid"
    );
    const now = new Date().toISOString().split("T")[0];

    const result = await executeQuery({
      query: `INSERT INTO tbl_tent_config (
        tent_config_uuid, tent_uuid, name, description, permissions, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      values: [
        tent_config_uuid,
        id,
        name,
        description,
        JSON.stringify(permissions),
        status,
        now,
        now,
      ],
    });

    return Response.json(
      { message: "Role created", uuid: tent_config_uuid },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to create role", details: error.message },
      { status: 500 }
    );
  }
}
