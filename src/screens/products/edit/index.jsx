"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { editProduct } from "@/actions/ProductActions";

const EditProducts = ({
  errorMessage,
  productTypes,
  technics,
  styles,
  patterns,
  product,
}) => {

  // ✅ PERBAIKAN: Gunakan colorStocks (bukan colorVariants)
  const [colorStocks, setColorVariants] = useState(
    product.colorStocks?.map((stock) => ({
      id: stock.productId,
      color: stock.color,    
      stock: stock.stock,
    })) ?? [] 
  );

  console.log("color", colorStocks);

  // ✅ HANDLER FUNCTIONS
  const addColorVariant = () => {
    setColorVariants([...colorStocks, { color: "", stock: 0 }]);
  };

  const removeColorVariant = (index) => {
    if (colorStocks.length <= 1) return;
    const newVariants = [...colorStocks];
    newVariants.splice(index, 1);
    setColorVariants(newVariants);
  };

  const updateColorVariant = (index, field, value) => {
    const newVariants = [...colorStocks];
    newVariants[index][field] = value;
    setColorVariants(newVariants);
  };

  const [priceTiers, setPriceTiers] = useState(
    product?.priceTiers?.map((tier) => ({
      productid: tier.productId,
      minQty: tier.minQty.toString(),
      maxQty: tier.maxQty?.toString() ?? "",
      unitPrice: tier.unitPrice.toString(),
    })) ?? []
  );
 console.log("Initial price tiers:", priceTiers);

  const addTier = () => {
    setPriceTiers([...priceTiers, { minQty: "", maxQty: "", unitPrice: "" }]);
  };

  const updateTier = (index, key, value) => {
    const tiers = [...priceTiers];
    tiers[index][key] = value;
    setPriceTiers(tiers);
  };

  const renderCheckboxGroup = (items, name, selectedItems) => {
    const selectedIds = selectedItems?.map((item) => item.id) ?? [];

    return (
      <div className="flex flex-wrap gap-3 pt-2">
        {items.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              id={`${name}-${item.id}`}
              name={name}
              value={item.id}
              className="hidden peer"
              defaultChecked={selectedIds.includes(item.id)}
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("priceTiers", JSON.stringify(priceTiers));

    try {
      await editProduct(formData, product.id, product.image);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold p-2">Edit Product</h1>

      {errorMessage && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-400 text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-x-6 gap-y-10 mt-10 grid-cols-2 px-2"
      >
        {/* ✅ Nama, Tipe, Gambar, Stok, Harga */}
        <div className="grid gap-2">
          <Label required={true}>Product Name</Label>
          <Input name="name" defaultValue={product.name} required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Type</Label>
          <select
            className="custom-input appearance-none cursor-pointer"
            name="productType"
            defaultValue={product.productTypeId}
          >
            {productTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label required={true}>MRP</Label>
          <Input name="mrp" defaultValue={product.mrp} />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Width</Label>
          <Input name="width" defaultValue={product.width || ""} required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Weight</Label>
          <Input name="weight" defaultValue={product.weight || ""} required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Material</Label>
          <Input
            name="material"
            defaultValue={product.material || ""}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>MOQ</Label>
          <Input name="moq" defaultValue={product.moq || ""} required />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Sample Price</Label>
          <Input
            name="sample_price"
            defaultValue={product.sample_price || ""}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Stock</Label>
          <Input
            name="currentStock"
            defaultValue={product.currentStock || ""}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Status</Label>
          <Switch
            name="isActive"
            defaultValue={product.isActive ? "on" : null}
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Product Customization</Label>
          <Switch
            name="isCustomization"
            defaultValue={product.isCustomization ? "on" : null}
          />
        </div>

        <div className="grid gap-2">
          <Label required={true}>Image URL</Label>
          <CustomFileInput name="image" defaultValue={product.image} />
        </div>

        {/* Deskripsi & Karakteristik */}
        <div className="grid col-span-2 gap-2">
          <Label required={true}>Description</Label>
          <textarea
            className="custom-input h-auto"
            name="description"
            rows={4}
            defaultValue={product.description}
          />
        </div>

        <div className="grid col-span-2 gap-2">
          <Label required={true}>Charateristic</Label>
          <textarea
            className="custom-input h-auto"
            name="charateristic"
            rows={4}
            defaultValue={product.charateristic || ""}
          />
        </div>

        {/* ✅ Checkbox Technics, Styles, Patterns */}
        <div className="col-span-2 grid gap-6 mt-4">
          <div>
            <Label>Technics</Label>
            {renderCheckboxGroup(technics, "technicIds", product.technics)}
          </div>
          <div>
            <Label>Styles</Label>
            {renderCheckboxGroup(styles, "styleIds", product.styles)}
          </div>
          <div>
            <Label>Patterns</Label>
            {renderCheckboxGroup(patterns, "patternIds", product.patterns)}
          </div>
        </div>

        <div className="col-span-2 mt-6">
          <Label required={true}>Varian Warna & Stock</Label>
          
          {/* Tampilkan total stock */}
          <div className="mb-3 p-2 bg-blue-50 rounded">
            <span className="font-medium">Total Stock: </span>
            <span className="text-lg font-bold">
              {colorStocks.reduce((total, variant) => total + (parseInt(variant.stock) || 0), 0)}
            </span>
          </div>
          
          {colorStocks.map((variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Nama Warna"
                  value={variant.color}
                  onChange={(e) => updateColorVariant(index, "colorName", e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-1">
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
                {colorStocks.length > 1 && (
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
            + Add Color Variant
          </Button>
        </div>

        {/* ✅ Price Tiers */}
        <div className="col-span-2 mt-6">
          {/* Label per kolom */}
          <div className="grid grid-cols-3 gap-4 mb-2">
            <Label required={true}>Min Qty</Label>
            <Label required={true}>Max Qty</Label>
            <Label required={true}>Unit Price</Label>
          </div>

          {/* Input tiap baris */}
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
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditProducts;
