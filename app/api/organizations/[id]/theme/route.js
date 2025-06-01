import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit";
import { getThemePreset } from "@/lib/theme-utils";

export async function GET(request, { params }) {
  try {
    const auth = checkAuth();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = params.id;

    // In a real app, fetch from database
    // For now, return the default theme configuration
    const savedThemeId = "default"; // This would come from database
    const themePreset = getThemePreset(savedThemeId);

    const themeConfig = {
      themeId: savedThemeId,
      preset: themePreset,
      fontFamily: themePreset?.fontFamily || "Inter",
      customizations: {
        // Any custom overrides would go here
      },
    };

    return NextResponse.json({ theme: themeConfig });
  } catch (error) {
    console.error("Get theme error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const auth = checkAuth();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizationId = params.id;
    const { themeId, fontFamily, customizations } = await request.json();

    // Validate theme exists
    const themePreset = getThemePreset(themeId);
    if (!themePreset) {
      return NextResponse.json({ error: "Invalid theme ID" }, { status: 400 });
    }

    // In a real app, save to database
    console.log("Saving theme for organization:", organizationId, {
      themeId,
      fontFamily,
      customizations,
    });

    // Log audit event
    await AuditLogger.log(
      AUDIT_ACTIONS.SETTINGS_CHANGED,
      auth.user.id,
      auth.organization.id,
      {
        setting: "theme",
        changes: {
          themeId,
          themeName: themePreset.name,
          fontFamily,
          category: themePreset.category,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Theme saved successfully",
      theme: {
        themeId,
        preset: themePreset,
        fontFamily,
        customizations,
      },
    });
  } catch (error) {
    console.error("Save theme error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Route for current organization theme update
export async function PUT(request) {
  try {
    const auth = checkAuth();
    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { themeId, fontFamily } = await request.json();

    // Validate theme exists
    const themePreset = getThemePreset(themeId);
    if (!themePreset) {
      return NextResponse.json({ error: "Invalid theme ID" }, { status: 400 });
    }

    // Save theme for current organization
    console.log(
      "Updating theme for current organization:",
      auth.organization.id,
      {
        themeId,
        fontFamily,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
      theme: {
        themeId,
        preset: themePreset,
        fontFamily,
      },
    });
  } catch (error) {
    console.error("Update theme error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
