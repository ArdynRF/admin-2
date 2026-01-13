"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { createProduct } from "@/actions/ProductActions";

const AddProducts = ({
  errorMessage,
  productTypes,
  technics,
  styles,
  patterns,
}) => {

  const [colorVariants, setColorVariants] = useState([
    { colorName: "", stock: 0 }
  ]);

  // ✅ HANDLER FUNCTIONS
  const addColorVariant = () => {
    setColorVariants([...colorVariants, { colorName: "", stock: 0 }]);
  };

  const removeColorVariant = (index) => {
    if (colorVariants.length <= 1) return;
    const newVariants = [...colorVariants];
    newVariants.splice(index, 1);
    setColorVariants(newVariants);
  };

  const updateColorVariant = (index, field, value) => {
    const newVariants = [...colorVariants];
    newVariants[index][field] = value;
    setColorVariants(newVariants);
  };

  const [priceTiers, setPriceTiers] = useState([
    { minQty: "", maxQty: "", unitPrice: "" },
  ]);

  const addTier = () => {
    setPriceTiers([...priceTiers, { minQty: "", maxQty: "", unitPrice: "" }]);
  };

  const updateTier = (index, key, value) => {
    const tiers = [...priceTiers];
    tiers[index][key] = value;
    setPriceTiers(tiers);
  };

  const renderCheckboxGroup = (items, name) => (
    <div className="flex flex-wrap gap-3 pt-2">
      {items.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            id={`${name}-${item.id}`}
            name={name}
            value={item.id}
            className="hidden peer"
          />
          <label
            htmlFor={`${name}-${item.id}`}
            className="checkbox-button-label"
          >
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("colorVariants", JSON.stringify(colorVariants));
    formData.append("priceTiers", JSON.stringify(priceTiers));
    try {
      await createProduct(formData);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold p-2">Add Product</h1>

      {errorMessage && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-400 text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-x-6 gap-y-10 mt-10 grid-cols-2 px-2"
      >
        {/* ✅ ID Barang */}
        <div className="grid gap-2">
          <Label required={true}>ID Barang</Label>
          <Input name="id_barang" placeholder="Masukkan ID Barang" required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Name</Label>
          <Input name="name" placeholder="Enter product name" required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Type</Label>
          <select
            className="custom-input appearance-none cursor-pointer"
            name="productType"
          >
            {productTypes?.map((productType) => (
              <option value={productType.id} key={productType.id}>
                {productType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label required={true}>MRP</Label>
          <Input placeholder="Enter MRP" name="mrp" />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Image URL</Label>
          <CustomFileInput name="image" />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Width</Label>
          <Input name="width" placeholder="Enter product width" required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Weight</Label>
          <Input name="weight" placeholder="Enter product weight" required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Material</Label>
          <Input
            name="material"
            placeholder="Enter product material"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>MOQ</Label>
          <Input name="moq" placeholder="Enter product MOQ" required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Sample Price</Label>
          <Input
            name="sample_price"
            placeholder="Enter product sample price"
            required
          />
        </div>

        {/* <div className="grid gap-2">
          <Label required={true}>Stock</Label>
          <Input
            name="currentStock"
            placeholder="Enter Stock product"
            required
          />
        </div> */}

        <div className="grid gap-2">
          <Label required={true}>Product Status</Label>
          <Switch name="isActive" />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Customization</Label>
          <Switch name="isCustomization" />
        </div>

        <div className="grid col-span-2 gap-2">
          <Label required={true}>Description</Label>
          <textarea
            className="custom-input h-auto"
            name="description"
            rows={4}
            placeholder="Enter Product Description"
          />
        </div>
        <div className="grid col-span-2 gap-2">
          <Label required={true}>Charateristic</Label>
          <textarea
            className="custom-input h-auto"
            name="charateristic"
            rows={4}
            placeholder="Enter Product Charateristic"
          />
        </div>

        {/* ✅ Technic, Style, Pattern Checkboxes */}
        <div className="col-span-2 grid gap-4 mt-2">
          <div>
            <Label>Technics</Label>
            {renderCheckboxGroup(technics, "technicIds")}
          </div>
          <div>
            <Label>Styles</Label>
            {renderCheckboxGroup(styles, "styleIds")}
          </div>
          <div>
            <Label>Patterns</Label>
            {renderCheckboxGroup(patterns, "patternIds")}
          </div>
        </div>

        <div className="col-span-2 mt-6">
          <Label required={true}>Color Variant & Stock</Label>
          
          {colorVariants.map((variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">    
              <div className="col-span-1">
                {/* Input nama warna */}
                <Input
                  type="text"
                  placeholder="Nama Warna"
                  value={variant.colorName}
                  onChange={(e) => updateColorVariant(index, "colorName", e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-1">
                {/* Input stock */}
                <Input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => updateColorVariant(index, "stock", e.target.value)}
                  min="0"
                  required
                />
              </div>
              
              <div className="col-span-1">
                {/* Tombol hapus - hanya muncul jika lebih dari 1 varian */}
                {colorVariants.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeColorVariant(index)}
                    variant="destructive"
                    className="w-full"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Button type="button" onClick={addColorVariant} className="mt-2">
            + Add
          </Button>
        </div>

        <div className="col-span-2 mt-6">
          <Label required={true}>Harga</Label>
          {priceTiers.map((tier, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <Input
                type="number"
                placeholder="Min Qty"
                value={tier.minQty}
                onChange={(e) => updateTier(index, "minQty", e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Max Qty"
                value={tier.maxQty}
                onChange={(e) => updateTier(index, "maxQty", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Unit Price"
                value={tier.unitPrice}
                onChange={(e) => updateTier(index, "unitPrice", e.target.value)}
                required
              />
            </div>
          ))}
          <Button type="button" onClick={addTier} className="mt-2">
            + Add Tier
          </Button>
        </div>

        <Button type="submit" className="w-52 col-span-2 mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddProducts;
