"use client";

import { useState } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import Image from "next/image";
import { DeleteIcon, EditIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/actions/ProductActions";

const Products = ({ products }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productList, setProductList] = useState(products); // local state untuk update setelah delete

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      setProductList(productList.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Gagal hapus produk:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-semibold text-3xl p-2"> Products Management </h1>
        <Link href="/products/add" className="custom-primary-btn">
          Add Product
        </Link>
      </div>

      <hr className="my-5" />

      <div className="mt-20 overflow-x-auto">
        <table className="custom-table w-full">
          <thead className="border-y-2 border-gray-400">
            <tr>
              <th>Image</th>
              <th>Name & Description</th>
              <th>MRP</th>
              <th>Product Type</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Price Tiers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium text-base text-center">
            {productList.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={`/${product.image}`}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-cover mx-auto"
                  />
                </td>
                <td>
                  <div className="flex flex-col items-start">
                    <span>{product.name}</span>
                    <span className="text-sm text-gray-500 truncate max-w-52">
                      {product.description}
                    </span>
                  </div>
                </td>
                <td>{product.mrp}</td>
                <td>
                  {product.productType?.name || `ID ${product.productTypeId}`}
                </td>
                <td>{product.currentStock}</td>
                <td
                  className={cn(
                    product.isActive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {product.isActive ? "Active" : "Inactive"}
                </td>
                <td className="text-sm text-left">
                  {product.priceTiers.map((tier, index) => (
                    <div key={index}>
                      Min: {tier.minQty} - Max: {tier.maxQty || "∞"} = $
                      {tier.unitPrice}
                    </div>
                  ))}
                </td>
                <td>
                  <div className="flex gap-x-3 justify-center">
                    <Link href={`/products/edit/${product.id}`}>
                      <EditIcon />
                    </Link>
                    <Button
                      className="bg-transparent p-0 px-2 border-none text-red-500"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedProduct(product);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isDeleteModalOpen && selectedProduct && (
          <DeleteConfirmationModal
            setIsOpen={setIsDeleteModalOpen}
            onCancel={() => setIsDeleteModalOpen(false)}
            handleConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
