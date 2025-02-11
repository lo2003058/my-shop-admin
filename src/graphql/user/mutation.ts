import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
            id
            email
        }
    }
`;
