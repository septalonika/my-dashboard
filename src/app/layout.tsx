import { inter, roboto } from "@/lib/fonts";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/molecules/app-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <Toaster position="top-center" />
          <main>{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
