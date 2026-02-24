# Gunakan base image Python yang stabil
FROM python:3.12-slim

# Set folder kerja
WORKDIR /app

# Install library pendukung sistem (untuk pemrosesan dasar)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy daftar library
COPY requirements.txt .

# Install library (tanpa library berat yang sudah dihapus)
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file proyek
COPY . .

# Ekspos port 8001
EXPOSE 8001

# Jalankan aplikasi
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]