import Branchadd from "@/sections/Controls/Branches/Add";

export default async function EditBranchPage({ params }) {
  const { id } = await params;

  return <Branchadd mode="edit" branchUuid={id} />;
}
