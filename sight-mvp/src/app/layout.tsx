import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sight — Compare KSA Credit Cards",
  description:
    "Compare credit cards in Saudi Arabia, check your eligibility, and calculate rewards. Arabic-first, Shariah-compliant options first-class.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Default to Arabic / RTL; the client I18nProvider updates this on toggle.
  return (
    <html lang="ar" dir="rtl">
      <body>
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
