import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TierFormData, TierFormProps } from '@/types/tier/types';
import { usePathname } from 'next/navigation';

const TierForm: React.FC<TierFormProps> = (
  {
    onSave,
    initialData = {},
    isEditMode = false,
  },
) => {

  const rawPathname = usePathname();
  const pathname = rawPathname.replace('/', '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TierFormData>({
    defaultValues: {
      name: initialData.name || '',
      requiredPoints: initialData.requiredPoints || 0,
    },
  });

  const onSubmit: SubmitHandler<TierFormData> = async (formData) => {
    const payload = {
      name: formData.name,
      requiredPoints: formData.requiredPoints,
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
          Required Points
        </label>
        <input
          type="number"
          placeholder="Required Points"
          {...register('requiredPoints', { required: 'Required points is required', valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.requiredPoints
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.requiredPoints && (
          <p className="text-red-500 text-sm mt-1">{errors.requiredPoints.message}</p>
        )}
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
          {
            isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Saving...'
              : isEditMode
                ? `Update ${pathname.toLowerCase()}`
                : `Save ${pathname.toLowerCase()}`
          }
        </button>
      </div>
    </form>
  );

};

export default TierForm;
