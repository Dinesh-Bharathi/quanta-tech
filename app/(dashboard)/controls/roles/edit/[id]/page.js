import RolesAdd from "@/sections/Controls/Roles/Add";

export default async function RolesEditPage({ params }) {
  const { id } = await params;

  return <RolesAdd mode="edit" roleUuid={id} />;
}
