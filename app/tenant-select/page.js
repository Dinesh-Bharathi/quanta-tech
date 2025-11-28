"use client";
import { TenantSelection } from "@/sections/TenantSelection/index";
import Loading from "../loading";
import { Suspense } from "react";

export default function TenantSelectionPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TenantSelection />
    </Suspense>
  );
}
