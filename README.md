# AI Portfolio of Manish Biswas

This project is a unique and interactive portfolio for Manish Biswas, presented as an 8-bit AI character that you can chat with.

## Description

This portfolio is designed to be an engaging way to learn more about Manish Biswas. It features an 8-bit avatar that provides answers to your questions through a chat interface. The AI is powered by Google's Generative AI, allowing for natural and dynamic conversations.

## Features

*   **Interactive Chat:** Engage in a conversation with an AI version of Manish Biswas.
*   **8-Bit Avatar:** A retro, 8-bit style avatar that changes with each response.
*   **Responsive Design:** The portfolio is designed to work on various screen sizes.
*   **Dynamic Responses:** The AI provides unique responses to your questions.

## Technologies Used

*   **Frontend:**
    *   HTML
    *   CSS
    *   JavaScript
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Google Generative AI
*   **Other:**
    *   dotenv

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/portfolioAI8bit.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd portfolioAI8bit
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file in the root directory and add your Google Generative AI API key:**
    ```
    GEMINI_API_KEY=your_api_key
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```
6.  **Verify the server is healthy (optional):**
    ```bash
    curl http://localhost:3001/health
    # { "ok": true }
    ```
7.  **Open the app:**
    - Option A: Open `http://localhost:3001/index.html` in your browser (served by the backend)
    - Option B: Open `index.html` directly from the filesystem; the frontend will call `http://localhost:3001/api/chat` automatically

## Usage

Once the application is running, you can interact with the AI by typing a message in the chat input and clicking "Send" or pressing Enter. The AI will respond to your questions and comments.

## Troubleshooting

- **No response / error:**
  - Ensure `GEMINI_API_KEY` is set in `.env` and the server was restarted.
  - Check the server logs where you ran `npm start`.
  - Test the backend: `curl -X POST http://localhost:3001/api/chat -H 'Content-Type: application/json' -d '{"message":"Hello"}'`
- **CORS / Mixed Content issues:**
  - Always use `http://localhost:3001` for the backend in local dev.
  - The server enables CORS globally.
- **Port already in use:**
  - Set a different port: `PORT=4001 npm start`, then visit `http://localhost:4001/index.html`. If opening `index.html` directly from file, it will still call `http://localhost:3001` by default, so prefer opening via the server when using a custom port.

## Screenshots

*(Coming Soon)*

## License

This project is licensed under the MIT License.
