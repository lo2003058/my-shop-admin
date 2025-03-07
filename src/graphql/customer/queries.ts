import { gql } from '@apollo/client';

export const GET_CUSTOMERS_PAGINATED = gql`
    query GetCustomersPaginated($page: Int!, $pageSize: Int!, $filter: CustomerFilterInput) {
        paginatedCustomer(page: $page, pageSize: $pageSize, filter: $filter) {
            items {
                id
                firstName
                lastName
                email
                phone
                countryCode
                status
                createdAt
                updatedAt
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;

export const GET_CUSTOMER_TIER = gql`
    query GetCustomerTier($id: Int!) {
        customer(id: $id) {
            tier {
                id
                name
            }
        }
    }
`;

export const GET_CUSTOMER_POINT = gql`
    query GetCustomerPoint($id: Int!) {
        customer(id: $id) {
            customerPoints {
                currentPoints
                accumulatedPoints
                totalAccumulatedPoints
            }
        }
    }
`;

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($id: Int!) {
        customer(id: $id) {
            order {
                id
                tax
                shippingFee
                originalTotal
                total
                status
                pointsEarned
                orderProduct {
                    product {
                        id
                        name
                        price
                        stock
                        isVirtual
                        imageUrl
                        createdAt
                        updatedAt
                    }
                    quantity
                }
                orderAddress{
                    name
                    phone
                    address
                    address2
                    city
                    state
                    country
                    zipCode
                }
                payment {
                    method
                    status
                    createdAt
                }
                createdAt
                updatedAt
            }
        }
    }
`;

export const GET_CUSTOMER_ADDRESSES = gql`
    query GetCustomerAddresses($customerId: Int!) {
        customerAddress(customerId: $customerId) {
            id
            tag
            firstName
            lastName
            countryCode
            phone
            address
            address2
            city
            state
            country
            zipCode
            isDefault
            customerId
        }
    }
`;

export const CREATE_CUSTOMER_ADDRESS = gql`
    mutation CreateCustomerAddress($input: CreateCustomerAddressInput!) {
        createCustomerAddress(createCustomerAddressInput: $input) {
            id
            tag
            firstName
            lastName
            countryCode
            phone
            address
            address2
            city
            state
            country
            zipCode
            isDefault
            customerId
        }
    }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddress($input: UpdateCustomerAddressInput!) {
        updateCustomerAddress(updateCustomerAddressInput: $input) {
            id
            tag
            firstName
            lastName
            countryCode
            phone
            address
            address2
            city
            state
            country
            zipCode
            isDefault
            customerId
        }
    }
`;

export const REMOVE_CUSTOMER_ADDRESS = gql`
    mutation RemoveCustomerAddress($id: Int!) {
        removeCustomerAddress(id: $id) {
            id
            tag
            firstName
            lastName
            countryCode
            phone
            address
            address2
            city
            state
            country
            zipCode
            isDefault
            customerId
        }
    }
`;

export const UPDATE_CUSTOMER_DEFAULT_ADDRESS = gql`
    mutation UpdateCustomerDefaultAddress($addressId: Int!,$customerId: Int!) {
        updateCustomerDefaultAddress(addressId: $addressId, customerId: $customerId) {
            id
        }
    }
`;
