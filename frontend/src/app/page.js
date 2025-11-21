"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-[100vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-6">
      {/* Card container */}
      <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-10 text-center shadow-xl">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-blue-400">
          Chat with Your PDFs
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-10">
          Upload your PDFs and instantly chat with them using AI. Sign in to get
          started.
        </p>

        {/* Auth Buttons */}
        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-500 transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="px-6 py-3 rounded-xl border-2 border-blue-500 text-blue-400 font-semibold hover:bg-blue-500/20 transition">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        {/* Redirect for logged-in users */}
        <SignedIn>
          <a
            href="/dashboard"
            className="mt-8 inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-500 transition"
          >
            Go to Dashboard →
          </a>
        </SignedIn>
      </div>
    </main>
  );
}
