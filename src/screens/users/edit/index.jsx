"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { updateUser } from "@/actions/userActions";
import { useRouter } from "next/navigation";

const EditUser = ({ userData, userId }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      await updateUser(formData, userId);
      router.push("/users"); // supaya tidak loop
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold p-2"> Edit User </h1>

      <form
        className="grid gap-x-6 gap-y-10 mt-10 grid-cols-2 px-2"
        action={handleSubmit}
      >
        <div className="grid gap-2">
          <Label required={true}>Username</Label>
          <Input
            placeholder="Enter Username"
            name="userName"
            defaultValue={userData.userName}
          />
        </div>
        <div className="grid gap-2">
          <Label required={true}>User Type</Label>
          <select
            className="custom-input appearance-none cursor-pointer"
            name="userType"
            defaultValue={userData.userType}
          >
            <option value="">Select User Type</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Reset Password</Label>
          <Input placeholder="Example@123" name="password" />
        </div>
        <div className="grid gap-2">
          <Label>Confirm Password</Label>
          <Input placeholder="Re-enter the Password" name="confirmPassword" />
        </div>

        <Button className="w-52 col-span-2 mt-2" disabled={isPending}>
          {isPending ? "Updating..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default EditUser;
