import { executeQuery } from "@/lib/db";

export async function PUT(req, { params }) {
  const { id } = await params;
  const { mainNavigation, footerNavigation } = await req.json();

  await executeQuery({
    query: `UPDATE tbl_tent_config
            SET role_modules = ?
            WHERE tent_config_uuid = ?`,
    values: [JSON.stringify({ mainNavigation, footerNavigation }), id],
  });

  return Response.json({
    message: "Role modules updated",
  });
}
