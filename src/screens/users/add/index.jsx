import { createUser } from "@/actions/userActions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Link from "next/link";

export default function AddUser({ searchParams }) {
  const { errorMessage, successMessage } = searchParams;

  return (
    <div className="p-4 md:p-6">
      {/* Header Section with Blue Accent */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center mb-3">
          <Link
            href="/users"
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
            <h1 className="font-bold text-3xl text-blue-900">Add New User</h1>
            <p className="text-blue-700 mt-2">
              Create a new user account with appropriate permissions
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                User Information
              </h2>
              <p className="text-blue-700 text-sm">
                Basic user details and credentials
              </p>
            </div>
          </div>
        </div>

        <form className="p-6" action={createUser}>
          {/* Basic Information Grid with Blue Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Username */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-900"
              >
                Username
              </Label>
              <Input
                placeholder="Enter username"
                name="userName"
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* User Type */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-900"
              >
                User Type
              </Label>
              <select
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-800"
                name="userType"
                required
              >
                <option value="" className="text-blue-300">
                  Select user type
                </option>
                <option value="Super Admin" className="text-blue-800">
                  Super Admin
                </option>
                <option value="Admin" className="text-blue-800">
                  Admin
                </option>
                <option value="Manager" className="text-blue-800">
                  Manager
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-900"
              >
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter password"
                name="password"
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-blue-600">
                Password must contain at least 8 characters with uppercase,
                lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-900"
              >
                Confirm Password
              </Label>
              <Input
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons with Blue Accent */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-blue-200">
            <Link href="/users">
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
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
