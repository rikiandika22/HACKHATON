# Gunakan base image Python
FROM python:3.10-slim

# Set folder kerja di dalam container
WORKDIR /app

# Install library pendukung untuk OpenCV/Sistem (jika ada pemrosesan citra)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy file requirements (daftar library) ke container
# Jika belum ada file requirements.txt, buat dulu (pip freeze > requirements.txt)
COPY requirements.txt .

# Install semua library (FastAPI, Uvicorn, LangChain, dll)
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file proyek (app.py, file .csv, folder src, dll) ke container
COPY . .

# Ekspos port sesuai yang ada di gambar kamu (port 8001)
EXPOSE 8001

# Jalankan aplikasi menggunakan uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]