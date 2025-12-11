import { inter, roboto } from "@/libs/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
