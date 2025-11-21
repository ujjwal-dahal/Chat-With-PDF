import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ask With PDF",
  description: "AI-powered PDF chat app with Clerk authentication",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100`}
        >
          {/* Navbar */}
          <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
            <h1 className="text-2xl font-bold tracking-tight text-blue-400">
              Ask With PDF
            </h1>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-lg border border-blue-500 text-blue-400 font-medium hover:bg-blue-500/10 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  signOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-blue-500",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </nav>

          {/* Page content */}
          <main className="p-10 max-w-6xl mx-auto">
            <div className="rounded-2xl bg-gray-900/60 backdrop-blur-lg shadow-xl border border-gray-800 p-8">
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
