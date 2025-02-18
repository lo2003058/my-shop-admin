import { gql } from "@apollo/client";

export const GET_USERS_PAGINATED = gql`
    query GetUsersPaginated($page: Int!, $pageSize: Int!, $filter: UserFilterInput) {
        paginatedUsers(page: $page, pageSize: $pageSize, filter: $filter) {
            items {
                id
                email
                username
                firstName
                lastName
                roleId
                role {
                    id
                    name
                }
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;

