import { gql } from '@apollo/client';

export const GET_ORDERS_PAGINATED = gql`
    query GetOrdersPaginated($page: Int!, $pageSize: Int!, $filter: OrderFilterInput) {
        paginatedOrders(page: $page, pageSize: $pageSize, filter: $filter) {
            items {
                id
                tax
                shippingFee
                originalTotal
                total
                status
                pointsEarned
                customer {
                    id
                    email
                }
                orderProduct {
                    product {
                        id
                        name
                        price
                        stock
                        isVirtual
                        imageUrl
                        createdAt
                        updatedAt
                    }
                    quantity
                }
                orderAddress{
                    name
                    phone
                    address
                    address2
                    city
                    state
                    country
                    zipCode
                }
                payment{
                    method
                    status
                    createdAt
                }
                createdAt
            }
            totalCount
            currentPage
            pageSize
            totalPages
        }
    }
`;

export const GET_ORDER = gql`
    query GetOrder($id: Int!) {
        order(id: $id) {
            id
            tax
            shippingFee
            originalTotal
            total
            status
            pointsEarned
            customer {
                id
                email
                countryCode
                phone
                tier {
                    id
                    name
                }
                customerPoints {
                    currentPoints
                    accumulatedPoints
                    totalAccumulatedPoints
                }
            }
            orderProduct {
                product {
                    id
                    name
                    price
                    stock
                    isVirtual
                    imageUrl
                    createdAt
                    updatedAt
                }
                quantity
            }
            orderAddress{
                name
                phone
                address
                address2
                city
                state
                country
                zipCode
            }
            payment{
                method
                paymentResponse
                stripeSessionId
                paymentIntentId
                status
                createdAt
            }
            createdAt
            updatedAt
        }
    }
`
