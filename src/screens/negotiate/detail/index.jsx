"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

const Detail = ({ detail }) => {
  const router = useRouter();
  
  console.log("Detail component received data:", detail);

  if (!detail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Negotiate not found
        </h1>
        <Button
          onClick={() => router.push("/negotiate")}
          className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-100"
        >
          Back to List
        </Button>
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
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

  return (
    <div className="min-h-screen p-6">
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
            Negotiate Details #{detail.id}
          </h1>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/negotiate/update/${detail.id}`}>
            <Button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Edit
            </Button>
          </Link>
          <Link href="/negotiate">
            <Button className="px-6 py-2 border border-gray-300 text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 rounded-md transition-colors duration-200">
              View All
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-8">
          {/* Header info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Negotiate ID
              </label>
              <p className="text-2xl font-bold text-gray-800">#{detail.id}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Status
              </label>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(detail.status)}`}>
                {detail.status?.toUpperCase() || "PENDING"}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Created Date
              </label>
              <p className="text-lg font-semibold text-gray-800">
                {formatDateTime(detail.createdAt)}
              </p>
            </div>
          </div>

          {/* User & Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    {detail.user?.name || `User #${detail.userId}`}
                  </p>
                </div>
                {detail.user?.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-lg text-blue-600">
                      {detail.user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                    {detail.product?.name || `Product #${detail.productId}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Quantity
                  </label>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {detail.quantity} unit(s)
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
                  {formatCurrency(detail.offeredPrice)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Seller Price
                </label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(detail.sellerPrice)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Final Price
                </label>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(detail.finalPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    {detail.color || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Expiration Date
                  </label>
                  <p className="mt-1 text-lg">
                    {formatDateTime(detail.expiresAt) || "No expiration"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                Notes
              </h2>
              <div className="mt-2 p-4 bg-gray-50 rounded-md min-h-[100px]">
                {detail.notes ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {detail.notes}
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
                <span className="font-medium">{formatDateTime(detail.createdAt)}</span>
              </div>
              
              {detail.respondedAt && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Responded</span>
                  <span className="font-medium">{formatDateTime(detail.respondedAt)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDateTime(detail.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;