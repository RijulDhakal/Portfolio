"use client";

import { useParams } from "next/navigation";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function AdminEditProjectPage() {
  const params = useParams<{ id: string }>();
  return <ProjectEditor id={params.id} />;
}
