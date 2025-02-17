import { gql } from '@apollo/client';

export const UPDATE_TIER = gql`
    mutation UpdateTier($input: UpdateTierInput!) {
        updateTier(updateTierInput: $input) {
            id
            name
            requiredPoints
        }
    }
`;
