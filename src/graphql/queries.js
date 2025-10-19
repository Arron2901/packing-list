/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const locations = /* GraphQL */ `
  query Locations {
    locations {
      id
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const location = /* GraphQL */ `
  query Location($id: ID!) {
    location(id: $id) {
      id
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const items = /* GraphQL */ `
  query Items {
    items {
      id
      locationId
      name
      quantity
      packed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const item = /* GraphQL */ `
  query Item($id: ID!) {
    item(id: $id) {
      id
      locationId
      name
      quantity
      packed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const itemsByLocation = /* GraphQL */ `
  query ItemsByLocation($locationId: ID!) {
    itemsByLocation(locationId: $locationId) {
      id
      locationId
      name
      quantity
      packed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const getLocation = /* GraphQL */ `
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
      id
      location
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLocations = /* GraphQL */ `
  query ListLocations(
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        location
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
      id
      locationId
      name
      quantity
      packed
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        locationId
        name
        quantity
        packed
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
