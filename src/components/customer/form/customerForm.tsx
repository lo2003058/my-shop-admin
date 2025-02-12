import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CustomerFormData, CustomerFormProps } from '@/types/customer/types';
import { usePathname } from 'next/navigation';
import _ from 'lodash';

const CustomerForm: React.FC<CustomerFormProps> = (
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
  } = useForm<CustomerFormData>({
    defaultValues: {
      email: initialData.email || '',
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      countryCode: initialData.countryCode || '',
      phone: initialData.phone || '',
      status: initialData.status ?? 0, // default to Active (0)
    },
  });

  const onSubmit: SubmitHandler<CustomerFormData> = async (formData) => {
    await onSave(formData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* First Name */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          First Name
        </label>
        <input
          type="text"
          placeholder="First Name"
          {...register('firstName', { required: 'First name is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.firstName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.lastName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Country Code */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Country Code
        </label>
        <input
          type="text"
          placeholder="Country Code"
          {...register('countryCode', { required: 'Country code is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.countryCode
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.countryCode && (
          <p className="text-red-500 text-sm mt-1">{errors.countryCode.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Phone
        </label>
        <input
          type="text"
          placeholder="Phone"
          {...register('phone', { required: 'Phone is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.phone
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Status
        </label>
        <select
          {...register('status', { required: 'Status is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.status
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        >
          <option value={0}>Active</option>
          <option value={1}>Inactive</option>
          <option value={2}>Banned</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Submit Button */}
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
              ? `Update ${_.capitalize(pathname)}`
              : `Save ${_.capitalize(pathname)}`}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
