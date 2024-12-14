import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listQuizzes } from './graphql/queries';
import { Auth } from 'aws-amplify';

function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();

        const session = await Auth.currentSession();
        const token = session?.getIdToken().getJwtToken();
        const response = await API.graphql({
          query: listQuizzes, authMode: "AMAZON_COGNITO_USER_POOLS",
          headers: { Authorization: token },
        });

        setQuizData(response?.data?.listQuizzes);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  if (quizData?.length === 0) {
    return <div>Loading...</div>;
  }

  const handleAnswerOptionClick = (selectedOption) => {
    const correctAnswer = quizData[currentQuestion].answer;
    setSelectedAnswer(selectedOption);

    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData?.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer("");
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {quizData?.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{quizData?.length}
            </div>
            <div className="question-text">
              {quizData[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {quizData[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerOptionClick(option)}
                style={{
                  backgroundColor:
                    selectedAnswer === option
                      ? isCorrect === null
                        ? 'lightgray'
                        : isCorrect
                          ? 'lightgreen'
                          : 'pink'
                      : '',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedAnswer && (
            <div style={{ marginTop: '10px' }}>
              {isCorrect ? 'Correct! 🎉' : 'Sorry, that’s not right. 😢'}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
