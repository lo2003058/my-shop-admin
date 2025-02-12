import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTag,
  faDollarSign,
  faInfoCircle,
  faBox,
  faCloud,
} from '@fortawesome/free-solid-svg-icons';
import { ProductViewProps } from '@/types/product/types';

const ProductView: React.FC<ProductViewProps> = ({ productData = {} }) => {
  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Product Details</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <Image
          src={productData.imageUrl || '/images/no-image-available.webp'}
          width={400}
          height={200}
          alt={productData.name || 'Product Image'}
          className="w-full h-48 object-cover rounded-t-lg"
          priority
        />
        <dl className="p-6 space-y-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTag} className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <dt className="text-sm font-semibold text-gray-900">Name</dt>
              <dd className="mt-1 text-base text-gray-900">
                {productData.name || 'N/A'}
              </dd>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <dt className="text-sm font-semibold text-gray-900">Price</dt>
              <dd className="mt-1 text-base text-gray-900">
                {typeof productData.price === 'number'
                  ? `$${productData.price.toFixed(2)}`
                  : 'N/A'}
              </dd>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="h-6 w-6 text-gray-400 mr-2"
            />
            <div>
              <dt className="text-sm font-semibold text-gray-900">Description</dt>
              <dd className="mt-1 text-base text-gray-900">
                {productData.description || 'N/A'}
              </dd>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBox} className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <dt className="text-sm font-semibold text-gray-900">Stock</dt>
              <dd className="mt-1 text-base text-gray-900">
                {productData.stock !== undefined ? productData.stock : 'N/A'}
              </dd>
            </div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCloud} className="h-6 w-6 text-gray-400 mr-2" />
            <div>
              <dt className="text-sm font-semibold text-gray-900">Type</dt>
              <dd className="mt-1 text-base text-gray-900">
                {productData.isVirtual ? 'Virtual' : 'Physical'}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProductView;
