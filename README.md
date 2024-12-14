# Quiz Application with AWS AppSync Integration

## Project Overview
This is a React-based quiz application that integrates with AWS AppSync and DynamoDB to retrieve and manage quiz questions. The application uses AWS Amplify for seamless authentication and API communication, ensuring a modern and scalable architecture.

## Features
- **Dynamic Quiz Questions**: Fetches questions, options, and answers dynamically from AWS AppSync.
- **Authentication**: User login and logout powered by AWS Cognito.
- **Real-time Feedback**: Displays feedback for correct and incorrect answers.
- **Score Tracking**: Tracks user scores and displays results at the end of the quiz.

## Installation & Setup
Follow the steps below to set up and run the quiz application locally.

### Prerequisites
- **Node.js** (version 14 or later): [Download Node.js](https://nodejs.org/)
- **AWS CLI**: [Install AWS CLI](https://aws.amazon.com/cli/)
- **Amplify CLI**: Install using `npm install -g @aws-amplify/cli`

### 1. Clone the Repository
```bash
git https://github.com/sagar-patel-99/quiz-app/
cd quiz-app
```

### 2. Install Dependencies
Run the following command to install required packages:
```bash
npm install
```

### 3. Initialize Amplify
Run the following commands to set up AWS Amplify in the project:
```bash
amplify init
```

### 4. Add AWS AppSync API
Set up AppSync to manage quiz questions:
```bash
amplify add api
```
- Select **GraphQL**.
- Use the default schema or define a custom schema like this:
  ```graphql
  type Quiz @model {
    questionID: ID!
    question: String!
    options: [String!]!
    answer: String!
  }
  ```
- Push the changes to AWS:
  ```bash
  amplify push
  ```

### 5. Configure Authentication
Add authentication to the application:
```bash
amplify add auth
```
- Select **default configuration**.
- Push the changes:
  ```bash
  amplify push
  ```

### 6. Start the Development Server
Run the following command to start the application locally:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure
- **`src/`**: Contains the main source code.
  - **`graphql/queries.js`**: GraphQL queries for fetching quiz data.
  - **`Quiz.js`**: Component implementing the quiz functionality.
  - **`App.js`**: Main application entry point.
- **`aws-exports.js`**: AWS Amplify configuration file.

## Running the Application
1. Open the application in your browser at `http://localhost:3000`.
2. Log in using AWS Cognito.
3. The quiz questions will load dynamically from DynamoDB via AppSync.

## Deployment
To deploy the application, use Amplify Hosting:
```bash
amplify add hosting
amplify publish
```
This will host your application on AWS.

## Testing
1. **Unit Tests**: Located in `src/__tests__/`.
2. **Running Tests**:
   ```bash
   npm test
   ```

## Technologies Used
- React.js
- AWS AppSync (GraphQL API)
- AWS Amplify (Frontend Framework)
- AWS Cognito (Authentication)
- DynamoDB (Database)
