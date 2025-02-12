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
                customerPoints {
                    currentPoints
                    accumulatedPoints
                    totalAccumulatedPoints
                }
                tier {
                    id
                    name
                }
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
