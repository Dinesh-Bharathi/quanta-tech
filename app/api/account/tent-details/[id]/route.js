import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { decryption, encryption } from "@/lib/encryption";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  const { id: tentId } = await params;

  if (!tentId) {
    return NextResponse.json(
      { error: "Invalid tent ID", details: validation.error.format() },
      { status: 400 }
    );
  }
  try {
    // Query tent details
    const result = await executeQuery({
      query:
        "SELECT tent_uuid,tent_name,tent_email,tent_phone_no,tent_street,tent_city,tent_state,tent_country,tent_pincode,tent_gst_no,tent_insta,tent_youtube,tent_facebook,tent_twitter,tent_web FROM tbl_tent_master WHERE tent_uuid = ?",
      values: [tentId],
    });

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Tent not found" }, { status: 404 });
    }

    const tent = result[0];

    const encryptedResponse = encryption(tent);

    return NextResponse.json({
      encrypted: true,
      data: encryptedResponse,
    });
  } catch (error) {
    console.error("Error fetching tent details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id: tentUuid } = await params;

  if (!tentUuid) {
    return NextResponse.json({ error: "Missing tentUuid" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const requestBody = decryption(body.data);

    const result = await updateAccountDetails(tentUuid, requestBody);

    if (!result) {
      return NextResponse.json(
        { error: "Account not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating account details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const updateAccountDetails = async (tentUuid, data) => {
  try {
    const {
      tent_name,
      tent_email,
      tent_phone_no,
      tent_street,
      tent_city,
      tent_state,
      tent_country,
      tent_pincode,
      tent_gst_no,
      tent_insta,
      tent_youtube,
      tent_facebook,
      tent_twitter,
      tent_web,
    } = data;

    const result = await executeQuery({
      query: `
        UPDATE tbl_tent_master SET 
          tent_name = ?, 
          tent_email = ?, 
          tent_phone_no = ?, 
          tent_street = ?, 
          tent_city = ?, 
          tent_state = ?, 
          tent_country = ?, 
          tent_pincode = ?, 
          tent_gst_no = ?, 
          tent_insta = ?, 
          tent_youtube = ?, 
          tent_facebook = ?, 
          tent_twitter = ?, 
          tent_web = ?,
          modified_on = NOW()
        WHERE tent_uuid = ?
      `,
      values: [
        tent_name,
        tent_email,
        tent_phone_no,
        tent_street,
        tent_city,
        tent_state,
        tent_country,
        tent_pincode,
        tent_gst_no,
        tent_insta,
        tent_youtube,
        tent_facebook,
        tent_twitter,
        tent_web,
        tentUuid,
      ],
    });

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating account details:", error);
    return false;
  }
};
