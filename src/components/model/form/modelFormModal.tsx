import React, { Fragment } from 'react';
import { ModelFormData, ModelFormModalProps } from '@/types/model/types';
import { useMutation } from '@apollo/client';
import { CREATE_MODEL, UPDATE_MODEL } from '@/graphql/model/mutation';
import Swal from 'sweetalert2';
import { GqlErrorMessage } from '@/types/error/types';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import ModelForm from '@/components/model/form/modelForm';
import _ from 'lodash';

const ModelFormModal: React.FC<ModelFormModalProps> = (
  {
    isOpen,
    onClose,
    editModel,
  },
) => {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace('/', '');

  const isEditMode = Boolean(editModel?.id);

  // Apollo Mutations
  const [createModel] = useMutation(CREATE_MODEL);
  const [updateModel] = useMutation(UPDATE_MODEL);

  const handleSave = async (formData: ModelFormData) => {
    try {
      if (isEditMode && editModel?.id) {
        // Update
        await updateModel({
          variables: {
            input: {
              id: editModel.id,
              ...formData,
            },
          },
        }).then(async () => {
          await Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${_.capitalize(pathname)} Updated Successfully`,
            text: `Your ${pathname.toLowerCase()} has been updated.`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        // Create
        await createModel({
          variables: {
            input: {
              ...formData,
            },
          },
        }).then(async () => {
          await Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${_.capitalize(pathname)} Created Successfully`,
            text: `Your new ${pathname.toLowerCase()} has been added.`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
      onClose(); // close modal after success
    } catch (err: unknown) {
      const error = err as GqlErrorMessage;
      // Extract error message
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        `Failed to save ${pathname.toLowerCase()}. Please try again.`;
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: `${_.capitalize(pathname)} Save Error`,
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  // Combine any existing data for the form
  const initialData = editModel
    ? {
      name: editModel.name,
      apiUrl: editModel.apiUrl,
      apiKey: editModel.apiKey,
      isDefault: editModel.isDefault,
      isShow: editModel.isShow,
    } : {};

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Fade-in backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        {/* Centered modal */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-hidden w-full max-w-3xl rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                {/* Title */}
                <div className="mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {isEditMode ? `Edit ${_.capitalize(pathname)}` : `Add New ${_.capitalize(pathname)}`}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500">
                    {isEditMode
                      ? 'Update the information below.'
                      : `Fill in the details below to create a new ${pathname.toLowerCase()}.`}
                  </p>
                </div>

                {/* Form */}
                <ModelForm
                  onSave={handleSave}
                  initialData={initialData}
                  isEditMode={isEditMode}
                />

                {/* Close (X) button in the top-right */}
                <div
                  className="absolute top-3 right-3 flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={onClose}
                >
                  <button
                    type="button"
                    className="text-black hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModelFormModal;
