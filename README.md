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
5.  **Start the app:**
    ```bash
    npm run dev
    ```
    The original Express AI backend is still available as `npm run server` (port 3001).

## PM portfolio CMS

The product-management site now lives at `/pm` (old `/pm-portfolio.html` redirects there). Case studies and skills are stored in **Supabase Postgres** and edited at `/admin` with a single secret key — not a public accounts system.

**Why ISR, not SSR:** public pages use Incremental Static Regeneration (`revalidate = 60`) plus `revalidatePath` after every admin write. Visitors usually get a cached page; your edits refresh the affected routes immediately. SSR would always be fresh but would hit the database on every request — unnecessary for a portfolio.

### First-time setup

1. Create a free [Supabase](https://supabase.com) project.
2. Copy `.env.example` to `.env.local` and fill in:
   - `ADMIN_SECRET` — a long passphrase only you know (never `NEXT_PUBLIC_`)
   - `DATABASE_URL` — Supabase **direct** Postgres URI (port 5432)
   - `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — for cover uploads
3. In the Supabase SQL editor, run `prisma/setup.sql` (creates tables + public `covers` bucket), **or** run `npx prisma db push`.
4. Seed the four existing case studies and six competencies:
   ```bash
   npm run db:seed
   ```
5. Add the same env vars in the Vercel project, then deploy. Open `/admin/login` (not linked in the public nav).

Hero stats: published case-study count and the sum of each study's `usersImpacted` field update automatically. The third hero stat is a site setting on the admin dashboard.

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
