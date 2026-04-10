import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Přihlášení",
  description: "Interní přístup do administrace webu a blogu.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <main className="main-with-header pt-24 pb-20 lg:pb-28">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <h1 className="section-title font-bold text-brand-text mb-4">Přihlášení</h1>
          <p className="text-brand-muted mb-8 text-sm">Administrace webu a blogu.</p>
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-brand-navy/15 via-brand-cyan/10 to-brand-navy/15 shadow-sm">
            <div className="bg-white rounded-2xl p-8 lg:p-10">
              <Suspense fallback={<p className="text-brand-muted text-sm">Načítám…</p>}>
                <LoginForm defaultNext="/admin" errorKey={sp.error} />
              </Suspense>
            </div>
          </div>
          <p className="mt-8 text-center">
            <Link href="/" className="text-brand-navy font-semibold hover:text-brand-cyan text-sm">
              ← Zpět na úvod
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
