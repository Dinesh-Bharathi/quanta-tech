import { executeQuery } from "@/lib/db";
import { encryption } from "@/lib/encryption";
import { NextResponse } from "next/server";
import _ from "lodash";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const users = await executeQuery({
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
        WHERE u.tent_uuid = ?
      `,
      values: [id],
    });

    const response = users.map((user, index) => ({
      id: user.user_uuid,
      user_uuid: user.user_uuid,
      name: user.name,
      email: user.email || "",
      role: user.role || "",
      contactNumber: user.phone_number || "",
      avatar: user.profile_img || "",
      createdAt: new Date(user.created_at).toISOString().split("T")[0] || "",
      lastLogin: user.last_login
        ? new Date(user.last_login).toISOString().split("T")[0]
        : "Never",
    }));

    const encryptResponse = encryption(response);

    return NextResponse.json({ encrypted: true, data: encryptResponse });
  } catch (error) {
    console.error("GET tent users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users for tent" },
      { status: 500 }
    );
  }
}
