"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";
import { RepairersAdmin } from "@/components/admin/RepairersAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export default function AdminPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl font-bold">Administration</h1>
        <CategoriesAdmin />
        <RepairersAdmin />
        <UsersAdmin />
      </div>
    </RequireAuth>
  );
}
