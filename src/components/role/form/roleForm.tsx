import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { RoleFormData, RoleFormProps } from '@/types/role/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const RoleForm: React.FC<RoleFormProps> = (
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    defaultValues: {
      name: initialData.name || '',
      permissions: initialData.permissions || [],
    },
  });

  // Local state for the new permission input
  const [newPermission, setNewPermission] = React.useState('');

  // Watch the permissions array to reflect updates in the form state.
  const permissions = watch('permissions') as string[];

  // Function to remove a permission at a given index.
  const removePermission = (index: number) => {
    const updatedPermissions = permissions.filter((_, i) => i !== index);
    setValue('permissions', updatedPermissions);
  };

  // Function to add a new permission to the list.
  const handleAddPermission = () => {
    const trimmedPermission = newPermission.trim();
    if (!trimmedPermission) return;

    // Add the new permission to the current list.
    const updatedPermissions = [...permissions, trimmedPermission];
    setValue('permissions', updatedPermissions);
    setNewPermission(''); // Clear the input field
  };

  const onSubmit: SubmitHandler<RoleFormData> = async (formData) => {
    const payload = {
      name: formData.name,
      permissions: formData.permissions,
    };
    await onSave(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Role Name Field */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Role Name
        </label>
        <input
          type="text"
          placeholder="Role Name"
          {...register('name', { required: 'Role name is required' })}
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

      {/* Permissions Field */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Permissions
        </label>

        <div className="mt-2 flex">
          <div className="-mr-px grid grow grid-cols-1 focus-within:relative">
            <input
              id="permission"
              name="permission"
              type="text"
              placeholder="Permission"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              className="col-start-1 row-start-1 block w-full border-gray-300 border-l border-t rounded-tl-lg bg-white py-1.5 pr-3 text-base text-gray-900 sm:pl-4 sm:text-sm/6"
            />
          </div>
          <div
            className="flex border-gray-300 border-t border-x shrink-0 items-center gap-x-1.5 rounded-tr-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative focus:outline focus:outline-2 focus:-outline-offset-2 cursor-pointer"
            onClick={handleAddPermission}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-b-lg border p-2.5 border-gray-300">
          {permissions && permissions.length > 0 ? (
            permissions.map((permission, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
              >
                {permission}
                <button
                  type="button"
                  className="group relative -mr-1 rounded-sm hover:bg-gray-500/20"
                  onClick={() => removePermission(index)}
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    viewBox="0 0 14 14"
                    className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75"
                  >
                    <path d="M4 4l6 6m0-6l-6 6" />
                  </svg>
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-md ml-2 select-none">
              No permissions set.
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Saving...'
            : isEditMode
              ? `Update ${pathname.toLowerCase()}`
              : `Save ${pathname.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
