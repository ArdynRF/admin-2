"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { updateTechnic } from "@/actions/technicActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EditTechnic = ({ technic, searchParams }) => {
  const { errorMessage } = searchParams;
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      try {
        await updateTechnic(formData, technic.id);
        setSuccessMessage("Technic updated successfully!");
        setTimeout(() => {
          router.push("/technic");
        }, 1500);
      } catch (error) {
        console.error("Error updating technic:", error);
      }
    });
  };

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
            <h1 className="font-bold text-3xl text-blue-900">Edit Technic</h1>
            <p className="text-blue-700 mt-2">Update technic information</p>
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Edit Technic Information
              </h2>
              <p className="text-blue-700 text-sm">
                Update technic details below
              </p>
            </div>
          </div>
        </div>

        <form className="p-6" action={handleSubmit}>
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
                defaultValue={technic.name}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
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
              defaultValue={technic.description || ""}
              placeholder="Enter description about this technic..."
            />
          </div>

          {/* Current Technic Info */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <h3 className="text-sm font-medium text-blue-700 mb-2">
              Current Technic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">ID:</span>
                <span className="ml-2 text-blue-800 font-medium">
                  {technic.id}
                </span>
              </div>
              <div>
                <span className="text-blue-600">Created:</span>
                <span className="ml-2 text-blue-800 font-medium">
                  {technic.createdAt
                    ? new Date(technic.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
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
                "Update Technic"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTechnic;
