import { v4 as uuidv4 } from "uuid";
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";
import { hashPassword } from "@/controllers/auth.controller";
import { encryption } from "@/lib/encryption";

export const runtime = "nodejs";

export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const { name, email, password, role, contactNumber } = body; // Modify according to actual schema

    // Check if user already exists
    const existingUsers = await executeQuery({
      query: "SELECT COUNT(*) as count FROM tbl_tent_users WHERE email = ?",
      values: [email],
    });

    if (existingUsers[0].count > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create the user
    const newUser = await createUser(
      id,
      name,
      email,
      password,
      role,
      contactNumber
    );

    const response = {
      status: "success",
      user: {
        id: newUser.user_uuid,
        user_uuid: newUser.user_uuid,
        name: newUser.name,
        email: newUser.email,
        role: _.capitalize(newUser.role),
        contactNumber: newUser.phone_number,
        avatar: newUser.profile_img || "",
        createdAt: new Date(newUser.created_at).toISOString().split("T")[0],
        lastLogin: newUser.last_login
          ? new Date(newUser.last_login).toISOString().split("T")[0]
          : "Never",
      },
    };

    const encryptResponse = encryption(response);

    return NextResponse.json(
      { encrypted: true, data: encryptResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await executeQuery({
      query: "DELETE FROM tbl_tent_users WHERE user_uuid = ?",
      values: [id],
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  const { name, email, role, contactNumber } = body;

  try {
    await executeQuery({
      query:
        "UPDATE tbl_tent_users SET name = ?, email = ?, role = ?,phone_number = ?  WHERE user_uuid = ?",
      values: [name, email, role, contactNumber, id],
    });

    const user = await executeQuery({
      query: `
    SELECT 
      u.user_uuid, 
      u.name, 
      u.email, 
      u.role, 
      u.phone_number, 
      u.profile_img,
      u.created_at,
      s.last_login
    FROM tbl_tent_users u
    LEFT JOIN (
      SELECT user_id, MAX(created_at) AS last_login
      FROM tbl_sessions
      GROUP BY user_id
    ) s ON u.user_id = s.user_id
    WHERE u.user_uuid = ?
  `,
      values: [id],
    });

    const response = {
      status: "success",
      user: {
        id: user.user_uuid,
        user_uuid: user.user_uuid,
        name: user.name,
        email: user.email,
        role: _.capitalize(user.role),
        contactNumber: user.phone_number,
        avatar: user.profile_img || "",
        createdAt: user.created_at
          ? new Date(user.created_at).toISOString().split("T")[0]
          : null,
        lastLogin: user.last_login
          ? new Date(user.last_login).toISOString().split("T")[0]
          : "Never",
      },
    };

    const encryptResponse = encryption(response);

    return NextResponse.json({ encrypted: true, data: encryptResponse });
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

async function createUser(
  tent_uuid,
  name,
  email,
  password,
  role = "user",
  contactNumber
) {
  const hashedPassword = await hashPassword(password);
  const id = uuidv4();

  await executeQuery({
    query:
      "INSERT INTO tbl_tent_users (user_uuid, name, email, password, role, tent_uuid, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
    values: [id, name, email, hashedPassword, role, tent_uuid, contactNumber],
  });

  const user = await executeQuery({
    query: `
    SELECT 
      u.user_uuid, 
      u.name, 
      u.email, 
      u.role, 
      u.phone_number, 
      u.profile_img,
      u.created_at,
      s.last_login
    FROM tbl_tent_users u
    LEFT JOIN (
      SELECT user_id, MAX(created_at) AS last_login
      FROM tbl_sessions
      GROUP BY user_id
    ) s ON u.user_id = s.user_id
    WHERE u.user_uuid = ?
  `,
    values: [id],
  });

  return user[0];
}
