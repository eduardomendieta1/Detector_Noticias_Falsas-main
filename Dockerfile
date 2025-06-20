# Imagen base ligera de Python 3.10
FROM python:3.10-slim

# Desactivar creación de archivos pyc y buffer de salida
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar todos los archivos al contenedor
COPY . .

# Instalar dependencias del sistema necesarias para librerías como tensorflow, matplotlib, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Exponer el puerto en el que correrá Gunicorn (puerto esperado por Render)
EXPOSE 8000

# Comando por defecto para iniciar la aplicación (ajusta "app:app" según tu estructura)
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]