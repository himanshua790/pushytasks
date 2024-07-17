
# Pushytasks

Pushytasks is a project developed for BRBBootcamp by PushProtocol, consisting of a React client and an Express.js server for handling push notifications and task management.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

Clone the repository:
bash
git clone <repository-url>
cd pushytasks
#### Client Setup

Navigate to the client folder and install dependencies:
bash
cd client
npm install
Create a `.env` file in the client folder and add the following:
plaintext
VITE_BASE_URL=
Start the React app:
bash
npm run dev
The client app will start at [http://localhost:3000](http://localhost:3000).

#### Server Setup

Navigate to the server folder and install dependencies:
bash
cd ../server
npm install
Create a `.env` file in the server folder and add the following:
plaintext
DB=<MongoDB-URI>
JWT_SECRET_KEY=<Your-JWT-Secret>
Start the Express server:
bash
npm run start
The server will start at [http://localhost:8000](http://localhost:8000).

## Folder Structure

- `/client`: Contains the React client application.
- `/server`: Contains the Express.js server application.

## Technologies Used

- React
- Express.js
- MongoDB
- Web Push (for push notifications)
- dotenv (for environment variables)

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


Replace <repository-url> with your actual Git repository URL. Make sure to update the MongoDB URI (<MongoDB-URI>) and JWT secret (<Your-JWT-Secret>) placeholders accordingly in your .env files.

This Markdown code provides a structured and formatted README.md for your "pushytasks" application. Adjust it further based on your specific project details or additional requirements.