"use client";
import React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import store from "@/redux/store";
import AuthWrapper from "@/components/AuthWrapper"; // New component to handle auth logic

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthWrapper>{children}</AuthWrapper>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}