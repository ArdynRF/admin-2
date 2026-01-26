"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { updateUser } from "@/actions/userActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EditUser = ({ userData, userId }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      try {
        await updateUser(formData, userId);
        setSuccessMessage("User updated successfully!");
        setTimeout(() => {
          router.push("/users");
        }, 1500);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    });
  };

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
            <h1 className="font-bold text-3xl text-blue-900">Edit User</h1>
            <p className="text-blue-700 mt-2">
              Update user information and permissions
            </p>
          </div>
        </div>
      </div>

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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Edit User Information
              </h2>
              <p className="text-blue-700 text-sm">
                Update user details and credentials
              </p>
            </div>
          </div>
        </div>

        <form className="p-6" action={handleSubmit}>
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
                defaultValue={userData.userName}
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
                defaultValue={userData.userType}
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

            {/* Password (Optional for Edit) */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-blue-900">
                Reset Password
              </Label>
              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                name="password"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-blue-600">
                Fill only if you want to change password
              </p>
            </div>

            {/* Confirm Password (Optional for Edit) */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-blue-900">
                Confirm New Password
              </Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                name="confirmPassword"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Current User Info Section */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <h3 className="text-sm font-medium text-blue-700 mb-2">
              Current User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Username:</span>
                <span className="ml-2 text-blue-800 font-medium">
                  {userData.userName}
                </span>
              </div>
              <div>
                <span className="text-blue-600">User Type:</span>
                <span className="ml-2 text-blue-800 font-medium">
                  {userData.userType}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-blue-600">User ID:</span>
                <span className="ml-2 text-blue-800 font-medium">{userId}</span>
              </div>
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
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
