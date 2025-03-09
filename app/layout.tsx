"use client";
import React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Ensure this matches your file structure
import { Provider } from "react-redux";
import store from "@/redux/store"; // Correct import
import AuthWrapper from "@/components/AuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false} // Disable system theme to rely on user toggle
            disableTransitionOnChange
          >
            <AuthWrapper>{children}</AuthWrapper>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}