"use client";

import { useState } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import { DeleteIcon, EditIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { deleteStyle } from "@/actions/styleActions"; // pastikan path ini sesuai

const Styles = ({ styles }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleDelete = async () => {
    await deleteStyle(selectedId);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-semibold text-3xl p-2">Style Management</h1>
        <Link href="/style-type/add" className="custom-primary-btn">
          Add Style
        </Link>
      </div>

      <hr className="my-5" />

      <div className="mt-20">
        <table className="custom-table">
          <thead className="border-y-2 border-gray-400">
            <tr>
              <th>Sr. No.</th>
              <th>Style Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium text-lg text-center">
            {styles.map((style, key) => (
              <tr key={style.id}>
                <td>{key + 1}</td>
                <td>{style.name}</td>
                <td className="flex items-center justify-center gap-x-3">
                  <Link href={`/style-type/edit/${style.id}`} className="w-fit">
                    <EditIcon />
                  </Link>
                  <Button
                    className="bg-transparent p-0 px-2 border-none text-red-500"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedId(style.id);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isDeleteModalOpen && (
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

export default Styles;
