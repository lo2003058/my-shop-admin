import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ModelFormData, ModelFormProps } from '@/types/model/types';
import { Switch } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const ModelForm: React.FC<ModelFormProps> = (
  {
    onSave,
    initialData = {},
    isEditMode = false,
  },
) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ModelFormData>({
    defaultValues: {
      name: initialData.name || '',
      apiUrl: initialData.apiUrl || '',
      apiKey: initialData.apiKey || '',
      defaultPrompt: initialData.defaultPrompt || '',
      isDefault: initialData.isDefault || false,
      isShow: initialData.isShow || true,
    },
  });

  const apiKeyValue = watch('apiKey');

  const maskApiKey = (key: string) => {
    if (!key) return '';
    return key.substring(0, 6) + '*'.repeat(Math.max(0, key.length - 6));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKeyValue);
    await Toast.fire({
      icon: "success",
      title: "API Key copied to clipboard"
    });
  };

  const onSubmit: SubmitHandler<ModelFormData> = async (formData) => {
    const payload = {
      name: formData.name,
      apiUrl: formData.apiUrl,
      apiKey: formData.apiKey,
      defaultPrompt: formData.defaultPrompt,
      isDefault: formData.isDefault,
      isShow: formData.isShow,
    };
    await onSave(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Model Name
        </label>
        <input
          type="text"
          placeholder="Model Name"
          {...register('name', { required: 'Model name is required' })}
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
          API Url
        </label>
        <input
          type="text"
          placeholder="API Url"
          {...register('apiUrl', { required: 'API Url is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
            errors.apiUrl
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.apiUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.apiUrl.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            placeholder="API Key"
            {...register('apiKey', { required: 'API Key is required' })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black pr-24 ${
              errors.apiKey
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            value={isEditMode ? (showApiKey ? apiKeyValue : maskApiKey(apiKeyValue)) : apiKeyValue}
            onChange={(e) => {
              register('apiKey').onChange(e);
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              title={showApiKey ? 'Hide API Key' : 'Show API Key'}
            >
              <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
            </button>
            <button
              type="button"
              onClick={handleCopyApiKey}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              title="Copy API Key"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        </div>
        {errors.apiKey && (
          <p className="text-red-500 text-sm mt-1">{errors.apiKey.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Default prompt
        </label>
        <textarea
          id="defaultPrompt"
          rows={14}
          {...register('defaultPrompt')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black resize-none ${
            errors.defaultPrompt
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500'
          }`}
        />
        {errors.defaultPrompt && (
          <p className="text-red-500 text-sm mt-1">{errors.defaultPrompt.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-md font-semibold text-gray-800">
          Is Default
        </label>
        <Controller
          control={control}
          name="isDefault"
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

      {/*<div className="mb-4">*/}
      {/*  <label className="block mb-1 text-md font-semibold text-gray-800">*/}
      {/*    Is Show*/}
      {/*  </label>*/}
      {/*  <Controller*/}
      {/*    control={control}*/}
      {/*    name="isShow"*/}
      {/*    render={({ field: { onChange, value } }) => (*/}
      {/*      <Switch*/}
      {/*        checked={value}*/}
      {/*        onChange={onChange}*/}
      {/*        className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${*/}
      {/*          value ? 'bg-indigo-600' : 'bg-gray-200'*/}
      {/*        }`}*/}
      {/*      >*/}
      {/*        <span*/}
      {/*          aria-hidden="true"*/}
      {/*          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${*/}
      {/*            value ? 'translate-x-5' : 'translate-x-0'*/}
      {/*          }`}*/}
      {/*        />*/}
      {/*      </Switch>*/}
      {/*    )}*/}
      {/*  />*/}
      {/*</div>*/}

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
              ? 'Update Model'
              : 'Save Model'}
        </button>
      </div>
    </form>
  );
};

export default ModelForm;
