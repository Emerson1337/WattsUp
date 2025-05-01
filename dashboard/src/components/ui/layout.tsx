import { Links, Meta, ScrollRestoration } from "react-router";
import { clsx } from "clsx";
import Navbar from "@/components/ui/navbar";
import { PreventFlashOnWrongTheme } from "remix-themes";

export default function Layout({
  children,
  theme,
  ssrTheme,
}: {
  children: React.ReactNode;
  theme: string;
  ssrTheme?: boolean;
}) {
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme ?? false} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <div className="container mx-auto p-4">{children}</div>
        <ScrollRestoration />
      </body>
    </html>
  );
}
