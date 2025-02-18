import { gql } from '@apollo/client';

export const GET_ACTION_LOG_PAGINATED = gql`
    query GetActionLogPaginated($page: Int!, $pageSize: Int!, $filter: ActionLogFilterInput) {
        paginatedActionLog(page: $page, pageSize: $pageSize, filter: $filter) {
            items {
                id
                userId
                timestamp
                action
                details
                isError
                user {
                    id
                    email
                    username
                    role {
                        id
                        name
                    }
                }
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;
