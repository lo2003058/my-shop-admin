import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found | Yin.co admin panel",
};

export default function notFound() {
  return (
    <>
      <div className="bg-white flex h-screen flex-col">
        <main className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
          <p className="text-base/8 font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Page not found
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10">
            <Link href="/" className="text-sm/7 font-semibold text-indigo-600">
              <span aria-hidden="true">&larr;</span> Back to home
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
