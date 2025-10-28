import RolesAdd from "@/sections/Controls/Roles/Add";

export default async function RolesEditPage({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/controls/tenant/role/permission/${id}`,
    {
      cache: "no-store",
    }
  );

  const roleData = await res.json();

  return <RolesAdd mode="edit" roleUuid={id} roleData={roleData} />;
}
