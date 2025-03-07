import { gql } from '@apollo/client';

export const CREATE_MODEL = gql`
    mutation CreateModel($input: CreateModelInput!) {
        createModel(createModelInput: $input) {
            id
            name
            apiUrl
            apiKey
            defaultPrompt
            isDefault
            isShow
        }
    }
`;

export const UPDATE_MODEL = gql`
    mutation UpdateModel($input: UpdateModelInput!) {
        updateModel(updateModelInput: $input) {
            id
            name
            apiUrl
            apiKey
            defaultPrompt
            isDefault
            isShow
        }
    }
`;

export const REMOVE_MODEL = gql`
    mutation RemoveModel($id: Int!) {
        removeModel(id: $id){
            id
        }
    }
`;
