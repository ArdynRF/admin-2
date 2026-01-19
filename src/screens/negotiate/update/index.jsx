"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { updateNegotiate } from "@/actions/negotiateActions";

const UpdateNegotiate = ({ negotiate }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk form - HANYA status dan notes
  const [formData, setFormData] = useState({
    status: negotiate?.status || "pending",
    notes: negotiate?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateNegotiate(negotiate.id, formData);
      
      setSuccess("Negotiate updated successfully!");
      setTimeout(() => {
        router.push(`/negotiate/detail/${negotiate.id}`);
        router.refresh();
      }, 1500);

    } catch (error) {
      setError(error.message || "Failed to update negotiate");
    } finally {
      setLoading(false);
    }
  };

  if (!negotiate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Negotiate not found
        </h1>
        <Link href="/negotiate">
          <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Back to List
          </Button>
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "countered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors duration-200 !bg-transparent !hover:bg-gray-100"
            variant="ghost"
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Update Negotiate #{negotiate.id}
          </h1>
        </div>
        
        <Link href={`/negotiate/detail/${negotiate.id}`}>
          <Button className="px-6 py-2 border border-gray-300 text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 rounded-md transition-colors duration-200">
            View Details
          </Button>
        </Link>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Data (Read-only) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">
              Current Negotiate Details
            </h2>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    User
                  </label>
                  <p className="text-lg font-medium">
                    {negotiate.user?.name || `User #${negotiate.userId}`}
                  </p>
                  {negotiate.user?.email && (
                    <p className="text-sm text-gray-500">{negotiate.user.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Product
                  </label>
                  <p className="text-lg font-medium">
                    {negotiate.product?.name || `Product #${negotiate.productId}`}
                  </p>
                </div>
              </div>

              {/* Price Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Quantity
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {negotiate.quantity} unit(s)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Offered Price
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(negotiate.offeredPrice)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Current Status
                  </label>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(negotiate.status)}`}>
                    {negotiate.status?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Seller Price
                  </label>
                  <p className="text-xl font-medium text-green-600">
                    {formatCurrency(negotiate.sellerPrice)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Final Price
                  </label>
                  <p className="text-xl font-medium text-purple-600">
                    {formatCurrency(negotiate.finalPrice)}
                  </p>
                </div>
              </div>

              {/* Color & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Color Preference
                  </label>
                  <p className="text-lg">
                    {negotiate.color || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created At
                  </label>
                  <p className="text-lg">
                    {formatDate(negotiate.createdAt)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Expires At
                  </label>
                  <p className="text-lg">
                    {formatDate(negotiate.expiresAt) || "No expiration"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">
              Update Negotiate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="countered">Countered</option>
                  <option value="expired">Expired</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Update the status of this negotiation
                </p>
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Add or update notes for this negotiation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Current notes: {negotiate.notes ? `${negotiate.notes.substring(0, 50)}...` : "No notes"}
                </p>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? "Updating..." : "Update Negotiate"}
                </Button>
                
                <Link href={`/negotiate/detail/${negotiate.id}`}>
                  <Button
                    type="button"
                    className="w-full mt-3 px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 shadow-sm flex items-center justify-center gap-2"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNegotiate;