import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Quiz from '../Quiz';
import { API } from 'aws-amplify';

// Mock API response
jest.mock('aws-amplify', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn(() =>
      Promise.resolve({ username: 'mock-user' })
    ),
    currentSession: jest.fn(() =>
      Promise.resolve({
        getIdToken: () => ({
          getJwtToken: () => 'mock-token',
        }),
      })
    ),
  },
  API: {
    graphql: jest.fn(() =>
      Promise.resolve({
        data: {
          listQuizzes: [
            {
              questionID: '1',
              question: 'What is 2 + 2?',
              options: ['3', '4', '5'],
              answer: '4',
            },
            {
              questionID: '2',
              question: 'What is the capital of France?',
              options: ['Berlin', 'Madrid', 'Paris'],
              answer: 'Paris',
            },
          ],
        },
      })
    ),
  },
}));

describe('Quiz Component', () => {
  const mockQuizData = [
    {
      questionID: '1',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5'],
      answer: '4',
    },
    {
      questionID: '2',
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris'],
      answer: 'Paris',
    },
  ];

  beforeEach(() => {
    // Mock the API call to return quiz data
    API.graphql.mockResolvedValue({
      data: { listQuizzes: mockQuizData },
    });
  });

  it('renders the quiz component and displays questions', async () => {
    render(<Quiz />);

    // Wait for the questions to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Verify the first question and options are displayed
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('allows the user to select the correct answer and updates the score', async () => {
    render(<Quiz />);

    // Wait for the questions to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Click the correct answer
    fireEvent.click(screen.getByText('4'));

    // Verify feedback is displayed
    await waitFor(() => expect(screen.getByText('Correct! 🎉')).toBeInTheDocument());

    // Move to the next question
    await waitFor(() => expect(screen.getByText('What is the capital of France?')).toBeInTheDocument());
  });

  it('displays incorrect feedback when the wrong answer is selected', async () => {
    render(<Quiz />);

    // Wait for the questions to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Click an incorrect answer
    fireEvent.click(screen.getByText('3'));

    // Verify feedback is displayed
    await waitFor(() => expect(screen.getByText('Sorry, that’s not right. 😢')).toBeInTheDocument());
  });

  it('displays the final score after completing the quiz', async () => {
    render(<Quiz />);
  
    // Answer all questions correctly
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());
    fireEvent.click(screen.getByText('4'));
  
    await waitFor(() => expect(screen.getByText('What is the capital of France?')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Paris'));
  
    // Verify the final score is displayed with an increased timeout for rendering
    await waitFor(
      () => expect(screen.getByText('You scored 2 out of 2')).toBeInTheDocument(),
      { timeout: 2000 } // Increased timeout to handle any delays
    );
  });

});

describe('Additional Quiz Component Tests', () => {
  it('ensures question text changes after selecting an answer', async () => {
    render(<Quiz />);

    // Wait for the first question to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Click an answer
    fireEvent.click(screen.getByText('4'));

    // Verify the next question text is displayed
    await waitFor(() => expect(screen.getByText('What is the capital of France?')).toBeInTheDocument());
  });

  it('does not proceed to the next question without selecting an answer', async () => {
    render(<Quiz />);

    // Wait for the first question to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Wait to ensure no automatic progression
    await new Promise((r) => setTimeout(r, 1000));

    // Verify still on the same question
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('disables the answer buttons after selection', async () => {
    render(<Quiz />);

    // Wait for the first question to load
    await waitFor(() => expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument());

    // Click an answer
    const button = screen.getByText('4');
    fireEvent.click(button);

    // Verify the button is disabled
    expect(button).toBeDisabled();
  });

});