import { Suspense } from "react";

import { AuthPageContent } from "@/components/auth/auth-page-content";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
