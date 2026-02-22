from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# LangChain Imports
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaLLM, OllamaEmbeddings

app = FastAPI(title="AUTOSPEC AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INISIALISASI AI & DATA ---
print("Sedang memuat database AI... Mohon tunggu.")

loaders = [
    CSVLoader(file_path='CarPrice_Assignment.csv', encoding='utf-8'),
    CSVLoader(file_path='Automobile.csv', encoding='utf-8'),
    CSVLoader(file_path='electric_vehicles_spec_2025.csv', encoding='utf-8')
]
docs = []
for loader in loaders:
    docs.extend(loader.load())

embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(documents=docs, embedding=embeddings)

llm = OllamaLLM(model="deepseek-r1")
print("AI Siap!")

class ChatRequest(BaseModel):
    message: str

@app.get("/", response_class=HTMLResponse)
async def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/chat", response_class=HTMLResponse)
async def chat_page():
    with open("chat.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        query = req.message
        docs_relevan = vectorstore.similarity_search(query, k=3)
        konteks = "\n".join([d.page_content for d in docs_relevan])

        # --- PROMPT DIPERBARUI AGAR LEBIH MENARIK ---
        prompt = f"""
        Anda adalah asisten ahli otomotif AUTOSPEC. Gunakan data spesifikasi berikut untuk menjawab pertanyaan.
        Jika data tidak ada, katakan data belum Anda miliki. Jawablah dengan bahasa yang natural, luwes, dan profesional.
        
        PENTING:
        1. Gunakan format **Tabel** jika menyajikan perbandingan atau banyak angka spesifikasi.
        2. Gunakan **Bullet points** untuk mendaftar fitur atau kelebihan.
        3. Berikan penjelasan narasi yang detail namun tetap beri jarak antar paragraf agar mudah dibaca.
        4. Jika di luar topik otomotif, tolak dengan sopan.

        DATA SPESIFIKASI:
        {konteks}

        PERTANYAAN:
        {query}
        """

        raw_response = llm.invoke(prompt)
        
        # Membersihkan tag <think> jika ada
        clean_response = raw_response.split("</think>")[-1].strip() if "</think>" in raw_response else raw_response
        
        # Catatan: Baris penghapus bintang (*) sudah dihilangkan agar tabel & tulisan tebal bisa berfungsi
        
        return JSONResponse(content={"reply": clean_response})
    
    except Exception as e:
        return JSONResponse(content={"reply": f"Error: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)