import { gql } from 'graphql-tag';

export const getQuiz = gql`
  query GetQuiz($questionID: ID!) {
    getQuiz(questionID: $questionID) {
      questionID
      question
      options
      answer
    }
  }
`;

export const listQuizzes = gql`
  query ListQuizzes {
    listQuizzes {
      questionID
      question
      options
      answer
    }
  }
`;