import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { UserFormData, UserFormProps } from '@/types/user/types';
import { useQuery } from '@apollo/client';
import LoadingComponent from '@/components/common/loadingComponent';
import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { GET_ROLES } from '@/graphql/role/queries';
import { Role } from '@/types/role/types';

const UserForm: React.FC<UserFormProps> = (
  {
    onSave,
    initialData = {},
    isEditMode = false,
  },
) => {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace('/', '');
  const { data: roleData, loading: roleLoading, error: roleError } = useQuery(GET_ROLES);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: {
      email: initialData.email || '',
      username: initialData.username || '',
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      roleId: initialData.roleId || 0,
      password: '',
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
    const payload: UserFormData = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      roleId: formData.roleId,
    };
    if (formData.password && formData.password.trim() !== '') {
      payload.password = formData.password;
    }
    await onSave(payload);
    reset();
  };

  if (roleLoading) return <LoadingComponent />;
  if (roleError) return <div>Error: {roleError.message}</div>;

  const roles = roleData.roles || [];
  const selectedRole = roles.find((role: { id: number; }) => role.id === watch('roleId')) || null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Email field remains the same */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Email
        </label>
        <input
          type="text"
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

      {/* Username field remains the same */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          {...register('username', { required: 'Username is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.username
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          {...register('password', {
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Role Select */}
      <div className="mb-4">
        <Listbox
          value={selectedRole}
          onChange={(role) => {
            setValue('roleId', role.id);
          }}
        >
          <label className="block mb-1 text-md font-semibold text-gray-800">
            Role
          </label>
          <div className="relative mt-2">
            <Listbox.Button
              className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
              <span className="col-start-1 row-start-1 truncate pr-6">
                {selectedRole?.name || 'Select Role'}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="col-start-1 row-start-1 h-5 w-5 self-center justify-self-end text-gray-500"
              />
            </Listbox.Button>
            <Listbox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {roles.map((role: Role) => (
                <Listbox.Option
                  key={role.id}
                  value={role}
                  className={({ active }) =>
                    `group relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {role.name}
                      </span>
                      {selected && (
                        <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}>
                          <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        {errors.roleId && (
          <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>
        )}
      </div>

      {/* First Name field remains the same */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          First Name
        </label>
        <input
          type="text"
          placeholder="First Name"
          {...register('firstName', { required: 'First Name is required' })}
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

      {/* Last Name field remains the same */}
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Last Name"
          {...register('lastName', { required: 'Last Name is required' })}
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

export default UserForm;
