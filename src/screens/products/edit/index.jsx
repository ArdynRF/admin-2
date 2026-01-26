"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { editProduct } from "@/actions/ProductActions";
import Link from "next/link";

const EditProducts = ({
  errorMessage,
  productTypes,
  technics,
  styles,
  patterns,
  product,
}) => {
  const [sampleProducts, setSamples] = useState(
    product.sampleProducts?.map((stock) => ({
      id: stock.productId,
      color_sample: stock.color_sample,
      stock_sample: stock.stock_sample,
    })) ?? [],
  );

  const [colorStocks, setColorStocks] = useState(
    product.colorStocks?.map((stock) => ({
      id: stock.productId,
      color: stock.color,
      stock: stock.stock,
    })) ?? [],
  );

  const [priceTiers, setPriceTiers] = useState(
    product?.priceTiers?.map((tier) => ({
      productid: tier.productId,
      minQty: tier.minQty.toString(),
      maxQty: tier.maxQty?.toString() ?? "",
      unitPrice: tier.unitPrice.toString(),
    })) ?? [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const addSample = () => {
    setSamples([...sampleProducts, { color_sample: "", stock_sample: 0 }]);
  };

  const removeSample = (index) => {
    if (sampleProducts.length <= 1) return;
    const newSamples = [...sampleProducts];
    newSamples.splice(index, 1);
    setSamples(newSamples);
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...sampleProducts];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  const addColorVariant = () => {
    setColorStocks([...colorStocks, { color: "", stock: 0 }]);
  };

  const removeColorVariant = (index) => {
    if (colorStocks.length <= 1) return;
    const newVariants = [...colorStocks];
    newVariants.splice(index, 1);
    setColorStocks(newVariants);
  };

  const updateColorVariant = (index, field, value) => {
    const newVariants = [...colorStocks];
    newVariants[index][field] = value;
    setColorStocks(newVariants);
  };

  const addTier = () => {
    setPriceTiers([...priceTiers, { minQty: "", maxQty: "", unitPrice: "" }]);
  };

  const removeTier = (index) => {
    if (priceTiers.length <= 1) return;
    const newTiers = [...priceTiers];
    newTiers.splice(index, 1);
    setPriceTiers(newTiers);
  };

  const updateTier = (index, key, value) => {
    const tiers = [...priceTiers];
    tiers[index][key] = value;
    setPriceTiers(tiers);
  };

  const renderCheckboxGroup = (items, name, selectedItems) => {
    const selectedIds = selectedItems?.map((item) => item.id) ?? [];

    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {items.map((item) => (
          <div key={item.id} className="relative">
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
              className="inline-flex items-center px-3 py-1.5 text-sm border border-blue-200 rounded-lg cursor-pointer peer-checked:bg-blue-100 peer-checked:border-blue-500 peer-checked:text-blue-700 hover:bg-blue-50 transition-colors"
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
    setIsSubmitting(true);
    setSuccessMessage("");

    const formData = new FormData(e.target);
    formData.append("priceTiers", JSON.stringify(priceTiers));
    formData.append("colorStocks", JSON.stringify(colorStocks));
    formData.append("sampleProducts", JSON.stringify(sampleProducts));

    try {
      await editProduct(formData, product.id, product.image);
      setSuccessMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header Section dengan Blue Accent */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center mb-3">
          <Link
            href="/products"
            className="mr-4 p-2 bg-white rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-3xl text-blue-900">Edit Product</h1>
            <p className="text-blue-700 mt-2">Update product details below</p>
          </div>
        </div>
      </div>

      {/* Error Message dengan Blue Accent */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Form Section dengan Blue Border */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Form Header dengan Blue Background */}
        <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Edit Product Information
              </h2>
              <p className="text-blue-700 text-sm">
                Update product details and specifications
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information Grid dengan Blue Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Product ID */}
            <div>
              <Label
                required={true}
                className="mb-1 block text-sm font-medium text-blue-700"
              >
                Product ID
              </Label>
              <Input
                name="id_barang"
                placeholder="Enter product ID"
                defaultValue={product.id_barang}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                readOnly
              />
            </div>

            {/* Product Name */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Product Name
              </Label>
              <Input
                name="name"
                placeholder="Enter product name"
                defaultValue={product.name}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Product Type */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Product Type
              </Label>
              <select
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-800"
                name="productType"
                defaultValue={product.productTypeId}
                required
              >
                <option value="" className="text-blue-300">
                  Select product type
                </option>
                {productTypes?.map((productType) => (
                  <option
                    value={productType.id}
                    key={productType.id}
                    className="text-blue-800"
                  >
                    {productType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* MRP */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                MRP (Maximum Retail Price)
              </Label>
              <Input
                placeholder="Enter MRP"
                name="mrp"
                type="number"
                defaultValue={product.mrp}
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Product Image
              </Label>
              <CustomFileInput
                name="image"
                defaultValue={product.image}
                className="w-full border-blue-200 hover:border-blue-400"
              />
              {product.image && (
                <div className="mt-2 text-xs text-blue-600">
                  Current: {product.image}
                </div>
              )}
            </div>

            {/* Width */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Width
              </Label>
              <Input
                name="width"
                placeholder="Enter product width"
                defaultValue={product.width || ""}
                required
                type="number"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Weight
              </Label>
              <Input
                name="weight"
                placeholder="Enter product weight"
                defaultValue={product.weight || ""}
                required
                type="number"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Material */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Material
              </Label>
              <Input
                name="material"
                placeholder="Enter product material"
                defaultValue={product.material || ""}
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* MOQ */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                MOQ (Minimum Order Quantity)
              </Label>
              <Input
                name="moq"
                placeholder="Enter product MOQ"
                defaultValue={product.moq || ""}
                required
                type="number"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Sample Price */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Sample Price
              </Label>
              <Input
                name="sample_price"
                placeholder="Enter sample price"
                defaultValue={product.sample_price || ""}
                required
                type="number"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Product Status
              </Label>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Switch name="isActive" defaultChecked={product.isActive} />
                <span className="text-sm font-medium text-blue-800">
                  Active Product
                </span>
              </div>
            </div>

            {/* Customization */}
            <div>
              <Label
                required={true}
                className="mb-2 block text-sm font-medium text-blue-700"
              >
                Customization Available
              </Label>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Switch
                  name="isCustomization"
                  defaultChecked={product.isCustomization}
                />
                <span className="text-sm font-medium text-blue-800">
                  Allow Customization
                </span>
              </div>
            </div>
          </div>

          {/* Description dengan Blue Accent */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <Label
              required={true}
              className="mb-2 block text-sm font-medium text-blue-700"
            >
              Description
            </Label>
            <textarea
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              name="description"
              rows={4}
              defaultValue={product.description}
              placeholder="Enter detailed product description..."
            />
          </div>

          {/* Characteristics dengan Blue Accent */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <Label
              required={true}
              className="mb-2 block text-sm font-medium text-blue-700"
            >
              Characteristics
            </Label>
            <textarea
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              name="charateristic"
              rows={4}
              defaultValue={product.charateristic || ""}
              placeholder="Enter product characteristics (features, benefits, etc)..."
            />
          </div>

          {/* Categories Section dengan Blue Border */}
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  Product Categories
                </h3>
                <p className="text-blue-700 text-sm">
                  Update product categories and attributes
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Technics */}
              <div className="p-4 border border-blue-100 rounded-lg bg-white">
                <Label className="mb-3 block text-sm font-bold text-blue-700">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    Technics
                  </span>
                </Label>
                {renderCheckboxGroup(technics, "technicIds", product.technics)}
              </div>

              {/* Styles */}
              <div className="p-4 border border-blue-100 rounded-lg bg-white">
                <Label className="mb-3 block text-sm font-bold text-blue-700">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Styles
                  </span>
                </Label>
                {renderCheckboxGroup(styles, "styleIds", product.styles)}
              </div>

              {/* Patterns */}
              <div className="p-4 border border-blue-100 rounded-lg bg-white">
                <Label className="mb-3 block text-sm font-bold text-blue-700">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    Patterns
                  </span>
                </Label>
                {renderCheckboxGroup(patterns, "patternIds", product.patterns)}
              </div>
            </div>
          </div>

          {/* Color Samples Section dengan Blue Accent */}
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">
                    Color Samples & Stock
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Update color samples with stock quantities
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addSample}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Sample
              </Button>
            </div>

            {/* Total Stock Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="font-medium text-blue-800">
                    Total Samples Stock:
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-900">
                  {sampleProducts.reduce(
                    (total, variant) =>
                      total + (parseInt(variant.stock_sample) || 0),
                    0,
                  )}
                </span>
              </div>
            </div>

            {sampleProducts.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end bg-white p-4 rounded-lg border border-blue-100"
              >
                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Color Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter color name"
                    value={variant.color_sample}
                    onChange={(e) =>
                      updateSample(index, "color_sample", e.target.value)
                    }
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Stock Quantity
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={variant.stock_sample}
                    onChange={(e) =>
                      updateSample(index, "stock_sample", e.target.value)
                    }
                    min="0"
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  {sampleProducts.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSample(index)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Color Variants Section dengan Blue Accent */}
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">
                    Color Variants & Stock
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Update color variants with stock quantities
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addColorVariant}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Variant
              </Button>
            </div>

            {/* Total Stock Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="font-medium text-blue-800">
                    Total Variants Stock:
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-900">
                  {colorStocks.reduce(
                    (total, variant) => total + (parseInt(variant.stock) || 0),
                    0,
                  )}
                </span>
              </div>
            </div>

            {colorStocks.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end bg-white p-4 rounded-lg border border-blue-100"
              >
                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Color Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter color name"
                    value={variant.color}
                    onChange={(e) =>
                      updateColorVariant(index, "color", e.target.value)
                    }
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Stock Quantity
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={variant.stock}
                    onChange={(e) =>
                      updateColorVariant(index, "stock", e.target.value)
                    }
                    min="0"
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  {colorStocks.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeColorVariant(index)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Tiers Section dengan Blue Accent */}
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">
                    Price Tiers
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Update quantity-based pricing tiers
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={addTier}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Tier
              </Button>
            </div>

            {priceTiers.map((tier, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end bg-white p-4 rounded-lg border border-blue-100"
              >
                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Minimum Quantity
                  </Label>
                  <Input
                    type="number"
                    placeholder="Min Qty"
                    value={tier.minQty}
                    onChange={(e) =>
                      updateTier(index, "minQty", e.target.value)
                    }
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Maximum Quantity
                  </Label>
                  <Input
                    type="number"
                    placeholder="Max Qty (optional)"
                    value={tier.maxQty}
                    onChange={(e) =>
                      updateTier(index, "maxQty", e.target.value)
                    }
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-blue-700">
                    Unit Price ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={tier.unitPrice}
                    onChange={(e) =>
                      updateTier(index, "unitPrice", e.target.value)
                    }
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Tambahkan button remove di sini */}
                <div className="flex gap-2">
                  {priceTiers.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons dengan Blue Accent */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-blue-200">
            <Link href="/products">
              <Button
                type="button"
                className="border border-blue-300 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProducts;
