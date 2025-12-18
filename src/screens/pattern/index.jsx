"use client";

import { useState } from "react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Link from "next/link";
import { DeleteIcon, EditIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { deletePattern } from "@/actions/patternActions";

const Patterns = ({ patterns }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const handleDelete = async () => {
    await deletePattern(selectedId);
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-semibold text-3xl p-2">Pattern Management</h1>
        <Link href="/pattern/add" className="custom-primary-btn">
          Add Pattern
        </Link>
      </div>

      <hr className="my-5" />

      <div className="mt-20">
        <table className="custom-table">
          <thead className="border-y-2 border-gray-400">
            <tr>
              <th>Sr. No.</th>
              <th>Pattern Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium text-lg text-center">
            {patterns.map((pattern, key) => (
              <tr key={pattern.id}>
                <td>{key + 1}</td>
                <td>{pattern.name}</td>
                <td className="flex items-center justify-center gap-x-3">
                  <Link href={`/pattern/edit/${pattern.id}`} className="w-fit">
                    <EditIcon />
                  </Link>
                  <Button
                    className="bg-transparent p-0 px-2 border-none text-red-500"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedId(pattern.id);
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

export default Patterns;
