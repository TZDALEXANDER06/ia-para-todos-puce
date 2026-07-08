import AdminDashboard from "./dashboard";
import StaticAdminNotice from "./static-notice";
import { videos, podcasts } from "@/data/project";

export const metadata = {
  title: "Panel de administracion"
};

export default function AdminPage() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return <StaticAdminNotice />;
  }

  return <AdminDashboard initialVideos={videos} initialPodcasts={podcasts} />;
}
