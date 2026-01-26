"use client";

import { createTechnic } from "@/actions/technicActions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Link from "next/link";

const AddTechnic = ({ errorMessage, successMessage }) => {
  return (
    <div className="p-4 md:p-6">
      {/* Header Section with Blue Accent */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center mb-3">
          <Link
            href="/technic"
            className="mr-4 p-2 bg-white rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-3xl text-blue-900">
              Add New Technic
            </h1>
            <p className="text-blue-700 mt-2">
              Create a new technic category for your products
            </p>
          </div>
        </div>
      </div>

      {/* Error Message with Blue Accent */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Form Section with Blue Border */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Form Header with Blue Background */}
        <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Technic Information
              </h2>
              <p className="text-blue-700 text-sm">
                Enter technic details below
              </p>
            </div>
          </div>
        </div>

        <form className="p-6" action={createTechnic}>
          {/* Basic Information Grid with Blue Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Technic Name */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Technic Name
              </Label>
              <Input
                placeholder="Enter technic name"
                name="name"
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-blue-600">
                Example: Embroidery, Weaving, Printing, etc.
              </p>
            </div>
          </div>

          {/* Description with Blue Accent */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <Label className="mb-2 block text-sm font-medium text-blue-700">
              Description (Optional)
            </Label>
            <textarea
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              name="description"
              rows={3}
              placeholder="Enter description about this technic..."
            />
          </div>

          {/* Submit Buttons with Blue Accent */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-blue-200">
            <Link href="/technic">
              <Button
                type="button"
                className="border border-blue-300 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5"
            >
              Create Technic
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechnic;
