import AdminPanel from "./panel";
import StaticAdminNotice from "./static-notice";
import { videos } from "@/data/project";

export const metadata = {
  title: "Panel de administracion"
};

export default function AdminPage() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return <StaticAdminNotice />;
  }

  return <AdminPanel initialVideos={videos} />;
}
