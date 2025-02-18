import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
            id
            email
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
            id
            email
        }
    }
`;

export const REMOVE_USER = gql`
    mutation RemoveUser($id: Int!) {
        removeUser(id: $id){
            id
        }
    }
`;
