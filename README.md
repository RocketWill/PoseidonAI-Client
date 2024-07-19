# Client Side

This is a frontend project based on Ant Design Pro and ReactJS, integrated with a backend service for managing a deep learning model training platform.

## Introduction

This project aims to provide a user-friendly interface for managing model training tasks, dataset uploads and management, model evaluation, and more. The backend is implemented using Python Flask and MongoDB.

## Key Features

- **User Management**
  - Register new users
  - Login and logout
  - User permission management

- **Dataset Management**
  - Upload datasets (supporting MSCOCO format)
  - View and manage datasets uploaded by users

- **Model Training Tasks**
  - Choose different algorithms or frameworks (e.g., YoloV8, Detectron2)
  - Real-time display of loss changes during training
  - Online evaluation or inference using trained models
  - Export model files

- **Other**
  - User-friendly interface with responsive design
  - Security considerations: JWT token authentication

## Technology Stack

- **Frontend**
  - Ant Design Pro
  - ReactJS

- **Backend**
  - Python Flask
  - MongoDB

## Deployment Steps

1. **Install Dependencies**

   ```bash
   yarn install
   ```

   > **Note:** Ensure npm version 18 or higher is installed in your development environment, and Yarn is globally installed. If Yarn is not installed, run the following command:

   ```bash
   npm install -g yarn
   ```

2. **Configure Environment Variables**

   Set backend API URLs and other configurations in the `.env` file.

   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start the Application**

   ```bash
   yarn start
   ```

   The application will run at `http://localhost:8000`. Make sure the backend service is running at the configured address.

## Development and Contributions

- For feature extensions or modifications, work in your development environment and ensure functional correctness through unit testing.
- When submitting a Pull Request, provide detailed descriptions of changes and fixes.

## FAQs

- For any issues or assistance, please contact the project lead.