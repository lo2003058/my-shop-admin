import React, { useState, useEffect } from 'react';
import { ProductAiFormProps } from '@/types/product/types';
import { useMutation, useQuery } from '@apollo/client';
import { Model, ModelsData } from '@/types/model/types';
import { GET_MODELS } from '@/graphql/model/queries';
import LoadingComponent from '@/components/common/loadingComponent';
import ContainersComponent from '@/components/common/containersComponent';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { GENERATE_PRODUCT_DESCRIPTION } from '@/graphql/products/mutation';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { GqlErrorMessage } from '@/types/error/types';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const ProductAiForm: React.FC<ProductAiFormProps> = ({ productData, onReturn }) => {
  const { data: session } = useSession();
  const adminToken = session?.accessToken;

  // GraphQL query for models
  const { data, loading, error } = useQuery<ModelsData>(GET_MODELS);

  // Mutation for generating product description
  const [generateProductDescription] = useMutation(GENERATE_PRODUCT_DESCRIPTION);

  // State for selected model, prompt text, generated response and loading indicator
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Update selectedModel and promptText when models data is loaded
  useEffect(() => {
    if (data?.models && data.models.length > 0) {
      const defaultModel = data.models.find(model => model.isDefault) || data.models[0];
      setSelectedModel(defaultModel);
      setPromptText(defaultModel?.defaultPrompt || '');
    }
  }, [data]);

  // Handle model selection from the Listbox
  const handleModelChange = (model: Model) => {
    setSelectedModel(model);
    setPromptText(model.defaultPrompt || '');
  };

  // Handle the generation of the AI response.
  const handleGenerateResponse = async () => {
    try {
      setIsGenerating(true);
      const { data: mutationData } = await generateProductDescription({
        variables: {
          input: {
            modelId: selectedModel?.id,
            prompt: promptText,
            productData: productData,
          },
        },
        context: {
          headers: { 'authorization-admin': `Bearer ${adminToken}` },
        },
      });
      // Assume the mutation returns the generated description string
      const generatedResponse = mutationData?.generateProductDescription;
      if (generatedResponse) {
        setResponse(generatedResponse);
        await Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Response Generated Successfully',
          text: 'Your response has been generated.',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error('No response received from API.');
      }
    } catch (err: unknown) {
      const errorObj = err as GqlErrorMessage;
      const errorMessage =
        errorObj?.graphQLErrors?.[0]?.message ||
        errorObj?.message ||
        'An error occurred while generating response.';
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Response Generation Error',
        text: errorMessage,
        timer: 1500,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Return the generated response to the parent component
  const handleReturnGenerateResponse = async () => {
    const responseObj = {
      response, // the generated response from state
    };
    await onReturn(responseObj);
  };

  if (loading) return <LoadingComponent />;
  if (error) {
    console.error(error);
    return (
      <ContainersComponent>
        <p className="text-red-500">Error loading model.</p>
      </ContainersComponent>
    );
  }

  const models = data?.models ?? [];

  return (
    <div className="space-y-6">

      {/*{productData && (*/}
      {/*  <div className="bg-white rounded-lg shadow-md border p-6">*/}
      {/*    <pre className="text-sm text-gray-700 overflow-auto">*/}
      {/*      {JSON.stringify(productData, null, 2)}*/}
      {/*    </pre>*/}
      {/*  </div>*/}
      {/*)}*/}

      <div className="mb-4">
        <Listbox value={selectedModel} onChange={handleModelChange}>
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-900">Select Model</Label>
            <div className="relative">
              <ListboxButton
                className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200">
                <span className="block truncate text-sm text-gray-700">
                  {selectedModel?.name || 'Select a model'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <ListboxOptions
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {models.map((model: Model) => (
                  <ListboxOption
                    key={model.id}
                    value={model}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none py-3 pl-4 pr-9 ${
                        active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                      } ${selected ? 'bg-indigo-50' : ''}`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {model.name}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-indigo-600' : 'text-indigo-600'}`}>
                            <FontAwesomeIcon icon={faCheck} className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </div>
        </Listbox>
      </div>

      <div className="mb-4">
        <label htmlFor="defaultPrompt" className="block text-sm font-medium text-gray-900">
          Prompts
        </label>
        <textarea
          id="defaultPrompt"
          rows={8}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="w-full px-4 py-3 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors duration-200"
          placeholder="Model prompt will appear here..."
        />
      </div>

      <hr className="h-px my-8 bg-gray-400 border-0" />

      <div className="mb-4">
        <label htmlFor="response" className="block text-sm font-medium text-gray-900">
          AI response
        </label>
        <textarea
          id="response"
          rows={6}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full px-4 py-3 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors duration-200"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={isGenerating}
          className={classNames(
            'w-full py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200',
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700',
          )}
          onClick={handleGenerateResponse}
        >
          {isGenerating ? 'Generating...' : 'Generate Response'}
        </button>
        <button
          type="button"
          disabled={isGenerating}
          className={classNames(
            'w-full py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200',
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700',
          )}
          onClick={handleReturnGenerateResponse}
        >
          Use it
        </button>
      </div>
    </div>
  );
};

export default ProductAiForm;
