import { NextResponse } from "next/server";
import { encryption } from "@/lib/encryption";
import { getCurrentUser } from "@/controllers/auth.controller";
import { profile } from "console";

export const runtime = "nodejs"; // required for using 'jose' or 'crypto'

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    // If user is not authenticated
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Sanitize and encrypt response
    const response = {
      userUuid: user.user_uuid,
      tentUuid: user.tent_uuid,
      name: user.name,
      email: user.email,
      role: user.role,
      contact: user.phone_number,
      createdAt: new Date(user.created_at).toISOString().split("T")[0],
      profile: user.profile_img || "",
    };

    const encryptedResponse = encryption(response);

    return NextResponse.json({
      encrypted: true,
      data: encryptedResponse,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
