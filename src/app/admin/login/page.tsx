import { Suspense } from "react";
import LoginForm from "./login-form";
import StaticAdminNotice from "../static-notice";

export const metadata = {
  title: "Acceso administrador"
};

export default function AdminLoginPage() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return <StaticAdminNotice />;
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
