"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import CustomFileInput from "@/components/ui/CustomFileInput";
import { createProduct } from "@/actions/ProductActions";
import Link from "next/link";

const AddProducts = ({
  errorMessage,
  productTypes,
  technics,
  styles,
  patterns,
}) => {
<<<<<<< HEAD
  const [colorSample, setColorSample] = useState([
    { color_sample: "", stock_sample: 0 },
=======

  const [sampleProducts, setSampleProducts] = useState([
    { color_sample: "", stock_sample: 0 }
>>>>>>> b1d6614105b3821abc39010ad01ea4219f382831
  ]);

  const addSample = () => {
    setSampleProducts([...sampleProducts, { color_sample: "", stock_sample: 0 }]);
  };

  const removeSample = (index) => {
    if (sampleProducts.length <= 1) return;
    const newSamples = [...sampleProducts];
    newSamples.splice(index, 1);
    setSampleProducts(newSamples);
  };

  const removeTier = (index) => {
    if (priceTiers.length <= 1) return;
    const newTiers = [...priceTiers];
    newTiers.splice(index, 1);
    setPriceTiers(newTiers);
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...sampleProducts];
    newSamples[index][field] = value;
    setSampleProducts(newSamples);
  };

  const [colorVariants, setColorVariants] = useState([
    { colorName: "", stock: 0 },
  ]);

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
    <div className="flex flex-wrap gap-2 pt-2">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <input
            type="checkbox"
            id={`${name}-${item.id}`}
            name={name}
            value={item.id}
            className="hidden peer"
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Tambah state success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(""); // Reset success message
    // ... reset errorMessage jika ada

    const formData = new FormData(e.target);
    formData.append("colorVariants", JSON.stringify(colorVariants));
    formData.append("priceTiers", JSON.stringify(priceTiers));
    formData.append("sampleProducts", JSON.stringify(sampleProducts));

    try {
      await createProduct(formData);
      setSuccessMessage("Product created successfully!"); // Set success message
      // Optionally reset form
      e.target.reset();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header Section with Blue Accent */}
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
            <h1 className="font-bold text-3xl text-blue-900">
              Add New Product
            </h1>
            <p className="text-blue-700 mt-2">
              Fill in the details below to add a new product to your inventory
            </p>
          </div>
        </div>
      </div>

      {/* Error Message with Blue Accent */}
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

      {/* Form Section with Blue Border */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Form Header with Blue Background */}
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Product Information
              </h2>
              <p className="text-blue-700 text-sm">
                Basic product details and specifications
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information Grid with Blue Accents */}
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
                required
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                className="w-full border-blue-200 hover:border-blue-400"
              />
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
                <Switch name="isActive" />
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
                <Switch name="isCustomization" />
                <span className="text-sm font-medium text-blue-800">
                  Allow Customization
                </span>
              </div>
            </div>
          </div>
          {/* Description with Blue Accent */}
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
              placeholder="Enter detailed product description..."
            />
          </div>
          {/* Characteristics with Blue Accent */}
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
              placeholder="Enter product characteristics (features, benefits, etc)..."
            />
          </div>
          {/* Categories Section with Blue Border */}
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
                  Select product categories and attributes
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
                {renderCheckboxGroup(technics, "technicIds")}
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
                {renderCheckboxGroup(styles, "styleIds")}
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
                {renderCheckboxGroup(patterns, "patternIds")}
              </div>
            </div>
          </div>
          {/* Color Samples Section with Blue Accent */}
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
                    Add color samples with stock quantities
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

            {colorSample.map((variant, index) => (
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
                  {colorSample.length > 1 && (
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
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD
          {/* Color Variants Section with Blue Accent */}
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
=======
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
          <Label required={true}>Warna Sampel & Stock</Label>
          
          {sampleProducts.map((variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">    
              <div className="col-span-1">
                {/* Input nama warna */}
                <Input
                  type="text"
                  placeholder="Nama Warna"
                  value={variant.color_sample}
                  onChange={(e) => updateSample(index, "color_sample", e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-1">
                {/* Input stock */}
                <Input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock_sample}
                  onChange={(e) => updateSample(index, "stock_sample", e.target.value)}
                  min="0"
                  required
                />
              </div>
              
              <div className="col-span-1">
                {/* Tombol hapus - hanya muncul jika lebih dari 1 varian */}
                {sampleProducts.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSample(index)}
                    variant="destructive"
                    className="w-full"
>>>>>>> b1d6614105b3821abc39010ad01ea4219f382831
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
                    Add color variants with stock quantities
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

            {colorVariants.map((variant, index) => (
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
                    value={variant.colorName}
                    onChange={(e) =>
                      updateColorVariant(index, "colorName", e.target.value)
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
                  {colorVariants.length > 1 && (
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
                    Set quantity-based pricing tiers
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
                      onClick={() => {
                        removeTier(index);
                      }}
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
          {/* Submit Buttons with Blue Accent */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-blue-200">
            <Link href="/products">
              <Button
                type="button"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5"
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
                  Creating...
                </span>
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
