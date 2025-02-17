import { gql } from '@apollo/client';

export const GET_TIER = gql`
    query GetTier($id: ID!) {
        tier(id: $id) {
            id
            name
            requiredPoints
        }
    }
`;

export const GET_TIERS = gql`
    query GetTiers {
        tiers {
            id
            name
            requiredPoints
        }
    }
`;
