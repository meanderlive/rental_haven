#!/bin/bash

echo "🚀 Starting RentalHaven Services..."

# Start Frontend (React)
echo "📱 Starting Frontend (Port 5173)..."
cd "$(dirname "$0")"
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Start Backend (Java Spring Boot)
echo "☕ Starting Backend (Port 8080)..."
cd java-backend
mvn spring-boot:run &
BACKEND_PID=$!

echo "✅ Services started!"
echo "📱 Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "☕ Backend:  http://localhost:8080 (PID: $BACKEND_PID)"
echo ""
echo "🛑 To stop services: kill $FRONTEND_PID $BACKEND_PID"
echo "📊 Check status: curl http://localhost:5173 && curl http://localhost:8080/api/bookings/user"

# Wait for user to stop
wait 