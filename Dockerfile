# Imagen ligera de Python compatible con TensorFlow y producción
FROM python:3.10-slim

# Evita mensajes interactivos
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar todos los archivos
COPY . .

# Instalar dependencias del sistema (algunas son necesarias para scipy, tensorflow, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Exponer el puerto de Gunicorn
EXPOSE 8000

# Comando para iniciar la app
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]