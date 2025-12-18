"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { updateStyle } from "@/actions/styleActions";

const EditStyle = ({ style, searchParams }) => {
  const { errorMessage } = searchParams;

  return (
    <div>
      <h1 className="text-3xl font-semibold p-2">Edit Style</h1>

      <form
        className="grid gap-x-6 gap-y-10 mt-10 grid-cols-2 px-2"
        action={(formData) => updateStyle(formData, style.id)}
      >
        {errorMessage && (
          <div className="col-span-2 border border-red-500 rounded-xl px-5 py-3 bg-red-50 w-fit">
            <span className="text-red-500 text-base font-medium">
              {errorMessage}
            </span>
          </div>
        )}

        <div className="grid gap-2">
          <Label required={true}>Style Name</Label>
          <Input
            placeholder="Enter Style Name"
            name="name"
            defaultValue={style.name}
          />
        </div>

        <div className="grid gap-2"></div>

        <Button className="w-52 col-span-2 mt-2">Submit</Button>
      </form>
    </div>
  );
};

export default EditStyle;
