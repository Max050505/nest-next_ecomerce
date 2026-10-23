import "./globals.css";
import { QueryProvider } from "@/providers/QueryProviders";
import { AuthProvider } from "@/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <QueryProvider>
          {/* <AuthProvider> */}
            <main>{children}</main>
          {/* </AuthProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
