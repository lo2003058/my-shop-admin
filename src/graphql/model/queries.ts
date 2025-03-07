import { gql } from '@apollo/client';

export const GET_MODELS = gql`
    query GetModels {
        models {
            id
            name
            defaultPrompt
            isDefault
        }
    }
`;

export const GET_MODELS_PAGINATED = gql`
    query GetModelsPaginated($page: Int!, $pageSize: Int!, $filter: ModelFilterInput) {
        paginatedModel(page: $page, pageSize: $pageSize, filter: $filter) {
            items {
                id
                name
                apiUrl
                apiKey
                defaultPrompt
                isDefault
                isShow
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
