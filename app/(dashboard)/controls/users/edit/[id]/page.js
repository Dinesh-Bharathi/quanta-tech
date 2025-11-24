import AddUser from "@/sections/Controls/Users/Add";

export default async function EditUserPage({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/controls/tenant/user/${id}`,
    {
      cache: "no-store",
    }
  );

  const userData = await res.json();

  return <AddUser mode="edit" userUuid={id} userData={userData?.data || {}} />;
}
