import AdminTabs from "@/components/admin/AdminTabs";

import { ChartsLoadingContainer, StatsLoadingContainer } from "@/components/admin/Loading";

import { Suspense } from "react";


async function AdminPage() {
  return (
    <>
      <Suspense fallback={<ChartsLoadingContainer />}>
       <AdminTabs/>
      </Suspense>
      
  
    </>
  );
}
export default AdminPage;