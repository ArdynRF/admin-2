"use client";

import { useState } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { deleteNegotiate } from "@/actions/negotiateActions";
import { useRouter } from "next/navigation";

const Negotiate = ({ negotiates }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleDelete = async () => {
    await deleteNegotiate(selectedId);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
    router.refresh(); // Refresh data setelah delete
  };

  const handleViewDetail = (id) => {
    router.push(`/negotiate/detail/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
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
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl p-2">Negotiate Management</h1>
        {/* <Link href="/negotiate/add" className="custom-primary-btn">
          Add Negotiate
        </Link> */}
      </div>

      <hr className="my-5" />

      <div className="mt-20">
        <table className="custom-table">
          <thead className="border-y-2 border-gray-400">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Offered Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium text-lg text-center">
            {negotiates.map((negotiate) => (
              <tr key={negotiate.id}>
                <td>{negotiate.id}</td>
                <td>{negotiate.user?.name || `User #${negotiate.userId}`}</td>
                <td>{negotiate.product?.name || `Product #${negotiate.productId}`}</td>
                <td>{negotiate.quantity}</td>
                <td>{formatCurrency(negotiate.offeredPrice)}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                      negotiate.status
                    )}`}
                  >
                    {negotiate.status.toUpperCase()}
                  </span>
                </td>
                <td>{formatDate(negotiate.createdAt)}</td>
                <td className="flex items-center justify-center gap-x-3">
                  <Button
                    className="bg-transparent p-0 px-2 border-none text-blue-500 hover:text-blue-700"
                    onClick={() => handleViewDetail(negotiate.id)}
                    title="View Details"
                  >
                    <EyeIcon />
                  </Button>
                  <Link
                    href={`/negotiate/update/${negotiate.id}`}
                    className="w-fit text-green-500 hover:text-green-700"
                    title="Edit"
                  >
                    <EditIcon />
                  </Link>
                  <Button
                    className="bg-transparent p-0 px-2 border-none text-red-500 hover:text-red-700"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedId(negotiate.id);
                    }}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {negotiates.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No negotiates found.
          </div>
        )}

        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            setIsOpen={setIsDeleteModalOpen}
            onCancel={() => setIsDeleteModalOpen(false)}
            handleConfirm={handleDelete}
            title="Delete Negotiate"
            message="Are you sure you want to delete this negotiate? This action cannot be undone."
          />
        )}
      </div>
    </div>
  );
};

export default Negotiate;