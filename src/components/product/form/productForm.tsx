import React from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Switch } from '@headlessui/react';

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  stock: number;
  isVirtual: boolean;
  imageUrl: string;
}

interface ProductFormProps {
  onSave: (serializedData: {
    name: string;
    price: number;
    description: string;
    stock: number;
    isVirtual: boolean;
    imageUrl: string;
  }) => Promise<void>;
  initialData?: Partial<{
    name: string;
    price: number;
    description: string;
    stock: number;
    isVirtual: boolean;
    imageUrl: string;
  }>;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = (
  {
    onSave,
    initialData = {},
    isEditMode = false,
  }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialData.name || '',
      price: initialData.price || 0,
      description: initialData.description || '',
      stock: initialData.stock || 0,
      isVirtual: initialData.isVirtual || false,
      imageUrl: initialData.imageUrl || '',
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (formData) => {
    const payload = {
      name: formData.name,
      price: formData.price,
      description: formData.description,
      stock: formData.stock,
      isVirtual: formData.isVirtual,
      imageUrl: formData.imageUrl,
    };
    await onSave(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Product Name
        </label>
        <input
          type="text"
          placeholder="Product Name"
          {...register('name', { required: 'Product name is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black resize-none ${
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Price
        </label>
        <input
          type="number"
          placeholder="Price"
          {...register('price', { required: 'Price is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.price
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Stock
        </label>
        <input
          type="number"
          placeholder="Stock"
          {...register('stock', { required: 'Stock is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.stock
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Image URL
        </label>
        <input
          type="text"
          placeholder="Image Url"
          {...register('imageUrl')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.imageUrl
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Updated Is Virtual field with Headless UI Switch */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Is virtual
        </label>
        <Controller
          control={control}
          name="isVirtual"
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              onChange={onChange}
              className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${
                value ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </Switch>
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Saving...'
            : isEditMode
              ? 'Update Product'
              : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
