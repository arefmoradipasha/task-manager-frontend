
import React from "react";
import "@/styles/globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html suppressHydrationWarning lang="fa" dir="rtl">
      <head />
      <body>
        <Providers themeProps={{ attribute: "class" }}>
          <div>
            <main className="text-foreground" >{children}</main>
          </div>
        </Providers>
      </body>
    </html>

  );
}
