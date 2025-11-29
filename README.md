# CentrAlign AI Assessment Submission

This is a full-stack web application that generates dynamic, shareable forms from natural language prompts using an LLM. It features a **Context-Aware Memory Layer** that ensures intelligent and scalable form generation, even with thousands of past user forms.

---

## 🌟 Key Features Implemented (Goals 1-8)

- **Authentication:** Users can sign up and log in using Email/Password (Basic Auth).  
- **AI Form Generation:** Converts natural language prompts into standardized **JSON form schemas** using an LLM (OpenAI/Gemini API).  
- **Context Memory Layer (RAG):** Implements a **Semantic Context Retrieval** system using vector search to find the top-K (5) most relevant past form schemas to guide new prompts.  
- **Scalability:** Handles 1,000–100,000+ past forms by sending only a **trimmed slice of context** to the LLM.  
- **Dynamic Rendering:** Forms are rendered from the JSON schema on a public shareable link (`/form/[id]`).  
- **Image Handling:** Supports image/file uploads (e.g., resumes, photos) via **Cloudinary**, storing only secure URLs in the database.  
- **Dashboard & Submissions:** Authenticated users can view all their created forms and see submissions grouped by form, including uploaded image URLs.  

---

## 🛠️ Tech Stack & Requirements

| Component | Requirement | Implementation |
|-----------|-------------|----------------|
| **Frontend** | Next.js 15 + TypeScript | Next.js (Pages Router), React, Axios |
| **Backend** | Express | Express.js, Node.js, JWT, bcrypt |
| **Database** | MongoDB (Atlas) | MongoDB Atlas with Mongoose |
| **AI** | Gemini API OR Free alternatives | OpenAI API (`gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings) |
| **Media Upload** | Managed upload service | Cloudinary |

---

## 🚀 Setup & Installation Instructions

### 1. Clone the Repository

```bash
git clone [YOUR_GITHUB_REPO_URL]
cd ai-form-app
2. Configure Environment Variables
Create two files: ./backend/.env and ./frontend/.env.local

backend/.env

ini
Copy code
PORT=4000
MONGODB_URI="<YOUR_ATLAS_CONNECTION_STRING_WITH_URL_ENCODED_PASSWORD>"
JWT_SECRET="super_secret_key"
OPENAI_API_KEY="sk-XXXXXXXX"
CLOUDINARY_CLOUD_NAME="<NAME>"
CLOUDINARY_API_KEY="<KEY>"
CLOUDINARY_API_SECRET="<SECRET>"
EMBED_MODEL="text-embedding-3-small"
LLM_MODEL="gpt-4o-mini"
frontend/.env.local

ini
Copy code
NEXT_PUBLIC_API="http://localhost:4000"
3. Install Dependencies & Run
Open two separate terminal windows:

Terminal 1 (Backend API):

bash
Copy code
cd backend
npm install
npm run dev
# Expected output: server started on 4000, mongo connected
Terminal 2 (Frontend App):

bash
Copy code
cd frontend
npm install
npm run dev
# Expected output: Ready - Local: http://localhost:3000
🧠 Architecture Notes: Context Memory Layer
How Semantic Retrieval Works
Vector Generation: Converts new prompts into high-dimensional embeddings.

Vector Search: Queries MongoDB Atlas Vector Search Index for similarity with stored form vectors.

Top-K Selection: Retrieves the top 5 most relevant past forms.

Prompt Assembly: Injects this context into the LLM prompt, guiding new form generation efficiently.

Scalability Considerations
Problem	Solution	Benefit
Token Size / LLM Prompt Limits	Retrieve only Top-K (3–10) forms	Reduces input token count, keeps costs low, avoids model context limits
Latency	Send smaller focused prompt	Minimizes LLM processing time
Thousands of Records	Vector Search Indexing	Fast retrieval from millions of records in milliseconds

📋 Example Prompts & Samples
Initial Prompt (No Context)
Prompt: "I need a job application form that accepts name, email, and a resume upload."
Result: Generates schema with name (string), email (email), and resume (file URL).

Contextual Prompt (After Sample 1)
Prompt: "Create an internship hiring form with a GitHub link and GPA validation."
Result: Includes previous fields (name, email), adds github_link, and new GPA validation field.

⚠️ Limitations & Future Improvements
Limitations:

LLM JSON output quality may vary; complex prompts may require retries.

Form validation rules (regex, length) depend on LLM consistency.

Future Improvements:

Integrate a dedicated vector database like Pinecone.

Implement schema caching & debouncing for semantic search.

Add client-side validation based on generated JSON schema rules.

