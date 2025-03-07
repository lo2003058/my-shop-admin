import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(createProductInput: $input) {
            id
            name
            description
            price
            stock
            imageUrl
            isVirtual
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
        updateProduct(updateProductInput: $input) {
            id
            name
            description
            price
            stock
            imageUrl
            isVirtual
        }
    }
`;

export const REMOVE_PRODUCT = gql`
    mutation RemoveProduct($id: Int!) {
        removeProduct(id: $id){
            id
        }
    }
`;

export const GENERATE_PRODUCT_DESCRIPTION = gql`
    mutation GenerateProductDescription($input: GenerateProductDescriptionInput!) {
        generateProductDescription(generateProductDescriptionInput: $input)
    }
`;
