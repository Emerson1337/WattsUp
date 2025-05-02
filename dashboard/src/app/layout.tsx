import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateLocaleSetup } from "@/components/locale/DateLocaleSetup";

setDefaultOptions({ locale: ptBR });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WattsUp - Dashboard",
  description: "Monitore o seu consumo elétrico!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link
          rel="icon"
          href="/"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DateLocaleSetup />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
