from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

# LangChain Imports
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

app = FastAPI(title="AUTOSPEC AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- TAMBAHKAN BARIS INI UNTUK MEMBACA FILE DESAIN & GAMBAR ---
app.mount("/src", StaticFiles(directory="src"), name="src")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
# (Catatan: Jika kamu punya folder lain seperti '/css' atau '/public', buatkan juga app.mount-nya dengan cara yang sama)

# --- KONFIGURASI API KEY GEMINI ---
# PENTING: Jangan lupa ganti dengan API Key milikmu yang valid
os.environ["GOOGLE_API_KEY"] = "AIzaSyBIi3pMMvNUsDKlsuHwLC1RlWhOEoyfRn8"

# --- INISIALISASI AI & DATA ---
print("LANGKAH 1: Sedang memuat database AI... Mohon tunggu.")

loaders = [
    CSVLoader(file_path='CarPrice_Assignment.csv', encoding='utf-8'),
    CSVLoader(file_path='Automobile.csv', encoding='utf-8'),
    CSVLoader(file_path='electric_vehicles_spec_2025.csv', encoding='utf-8')
]
docs = []
for loader in loaders:
    docs.extend(loader.load())

# --- SOLUSI ERROR 429 (RESOURCE EXHAUSTED) ---
# Karena API Gemini gratis membatasi maksimal 100 request per menit,
# kita batasi dulu datanya (misal 50 baris pertama) untuk testing agar tidak error.
# Jika ingin semua data, Anda perlu API berbayar atau menggunakan model embedding lokal (seperti HuggingFace).
docs = docs[:50] 

print(f"LANGKAH 2: Berhasil membaca {len(docs)} baris data dari CSV!")

# Menggunakan model embedding terbaru agar tidak error 404
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
vectorstore = Chroma.from_documents(documents=docs, embedding=embeddings)

print("LANGKAH 3: Vector Database berhasil dibuat!")

# Setup LLM Gemini 2.5 Flash
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5)
print("LANGKAH 4: AI Siap! Menyalakan server... (Bismillah nyala!)")

class ChatRequest(BaseModel):
    message: str

@app.get("/", response_class=HTMLResponse)
async def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/chat.html", response_class=HTMLResponse)
async def chat_page():
    with open("chat.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/login.html", response_class=HTMLResponse)
async def login_page():
    try:
        with open("login.html", "r", encoding="utf-8") as f:
            return f.read()
    except:
        return "Halaman Login Belum Tersedia"

@app.get("/register.html", response_class=HTMLResponse)
async def register_page():
    try:
        with open("register.html", "r", encoding="utf-8") as f:
            return f.read()
    except:
        return "Halaman Register Belum Tersedia"


@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        query = req.message
        
        # Mencari 4 potong data paling relevan dari file CSV
        docs_relevan = vectorstore.similarity_search(query, k=4)
        konteks = "\n".join([d.page_content for d in docs_relevan])

        # --- PENGGABUNGAN PROMPT GAYA REVIEWER ---
        prompt = f"""
        Kamu adalah 'AutoSpec AI', konsultan otomotif dan reviewer mobil handal.
        Tugas UTAMA kamu adalah menjawab pertanyaan tentang spesifikasi mobil HANYA berdasarkan database berikut:
        {konteks}

        ATURAN MUTLAK CARA MENJAWAB:
        1. GAYA BAHASA REVIEWER SANTAY: Gunakan bahasa Indonesia yang asyik, luwes, dan mengalir seperti orang ngobrol (gunakan sapaan ramah). DILARANG menggunakan kalimat kaku seperti "Berdasarkan database kami" atau "Berikut adalah rangkuman perbedaannya".
        2. HARAM MENYEBUT KODE ATAU ID: JANGAN PERNAH menyebutkan "Kode database", "Car ID", "Varian Pertama", atau urutan tabel lainnya. 
        3. BERCERITA, BUKAN BIKIN LIST: Jika ada beberapa varian mobil, ceritakan perbedaannya dalam bentuk paragraf perbandingan yang enak dibaca. 
        4. ISTILAH MANUSIA: 
           - `gas` = Mesin Bensin
           - `fwd` = Penggerak Depan (FWD)
           - `std` = Naturally Aspirated (Non-Turbo)
           - Kolom `enginesize` itu ukurannya, jangan sebut 'cc' jika angkanya aneh/kecil.
        5. FORMAT TAMPILAN: Gunakan format **Tabel** HANYA JIKA membandingkan banyak angka spesifikasi sekaligus agar rapi. 
        6. KESIMPULAN REVIEWER: Di akhir jawaban, kasih opini profesional. Misalnya komentari apakah mobil ini tergolong irit atau tenaganya pas-pasan.
        7. JIKA DATA TIDAK ADA: Jawab santai: "Maaf, mobil itu belum masuk garasi database AutoSpec. Mau cek spek mobil yang lain?"

        PERTANYAAN:
        {query}
        """

        raw_response = llm.invoke(prompt).content
        
        # Membersihkan tag <think> jika model memberikan proses berpikir
        clean_response = raw_response.split("</think>")[-1].strip() if "</think>" in raw_response else raw_response
        
        return JSONResponse(content={"reply": clean_response})
    
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return JSONResponse(content={"reply": "Maaf, mesin AI lagi sedikit overheat nih. Coba tanya lagi ya!"}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)