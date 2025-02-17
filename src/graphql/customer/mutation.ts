import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
    mutation CreateCustomer($input: CreateCustomerInput!) {
        createCustomer(createCustomerInput: $input) {
            id
            firstName
            lastName
            email
            phone
            countryCode
        }
    }
`;

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(updateCustomerInput: $input) {
            id
            firstName
            lastName
            email
            phone
            countryCode
        }
    }
`;

export const REMOVE_CUSTOMER = gql`
    mutation RemoveCustomer($id: Int!) {
        removeCustomer(id: $id){
            id
        }
    }
`;
