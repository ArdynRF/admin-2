"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { getNegotiateById } from "@/actions/negotiateActions";

const Detail = ({ errorMessage, params }) => {
  const router = useRouter();
  const [negotiate, setNegotiate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ambil ID dari params jika ada, atau dari URL
  const negotiateId = params?.id;

  useEffect(() => {
    const fetchNegotiate = async () => {
      if (!negotiateId) return;
      
      try {
        setLoading(true);
        const data = await getNegotiateById(negotiateId);
        setNegotiate(data);
      } catch (error) {
        console.error("Error fetching negotiate details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNegotiate();
  }, [negotiateId]);

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, HH:mm", { locale: id });
    } catch (error) {
      return "-";
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading negotiate details...</div>
      </div>
    );
  }

  if (!negotiate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Negotiate not found</h1>
        <Button
          onClick={() => router.back()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header dengan tombol back */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            variant="ghost"
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Negotiate Details</h1>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/negotiate/edit/${negotiate.id}`}>
            <Button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Edit Negotiate
            </Button>
          </Link>
          <Link href="/negotiate">
            <Button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* Error message jika ada */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-8">
          {/* Header info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Negotiate ID
              </label>
              <p className="text-2xl font-bold text-gray-800">#{negotiate.id}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Status
              </label>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(negotiate.status)}`}>
                {negotiate.status.toUpperCase()}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Created Date
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {formatDateTime(negotiate.createdAt)}
              </p>
            </div>
          </div>

          {/* User & Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                User Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    User Name
                  </label>
                  <p className="mt-1 text-lg">
                    {negotiate.user?.name || `User #${negotiate.userId}`}
                  </p>
                </div>
                {negotiate.user?.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-lg text-blue-600">
                      {negotiate.user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                Product Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Product Name
                  </label>
                  <p className="mt-1 text-lg">
                    {negotiate.product?.name || `Product #${negotiate.productId}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Quantity Requested
                  </label>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {negotiate.quantity} unit(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b">
              Price Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Offered Price
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(negotiate.offeredPrice)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Seller Price
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(negotiate.sellerPrice)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Final Price
                </label>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(negotiate.finalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Color & Notes */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                Additional Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Color Preference
                  </label>
                  <p className="mt-1 text-lg">
                    {negotiate.color || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Expiration Date
                  </label>
                  <p className="mt-1 text-lg">
                    {formatDateTime(negotiate.expiresAt) || "No expiration"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                Notes
              </h2>
              <div className="mt-2 p-4 bg-gray-50 rounded-md min-h-[100px]">
                {negotiate.notes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {negotiate.notes}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No notes provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDateTime(negotiate.createdAt)}</span>
              </div>
              
              {negotiate.respondedAt && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Responded</span>
                  <span className="font-medium">{formatDateTime(negotiate.respondedAt)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDateTime(negotiate.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;