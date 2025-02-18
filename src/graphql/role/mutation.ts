import { gql } from '@apollo/client';

export const CREATE_ROLE = gql`
    mutation CreateRole($input: CreateRoleInput!) {
        createRole(createRoleInput: $input) {
            id
            name
            permissions
        }
    }
`;

export const UPDATE_ROLE = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
        updateRole(updateRoleInput: $input) {
            id
            name
            permissions
        }
    }
`;
