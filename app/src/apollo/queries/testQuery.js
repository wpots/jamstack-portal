import { gql } from '@apollo/client/core';

const testQuery = gql`
  query GetMembers {
    memberCollection {
      items {
        firstName
      }
    }
  }`;

export default testQuery;
