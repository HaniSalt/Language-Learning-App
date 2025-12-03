package main

import (
    "log"
    "os"
    "user-service/internal/firebase"
    "user-service/internal/handlers"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load(".config.env")
    if err != nil {
        log.Println("No .env file found")
    }

    err = firebase.InitFirebase()
    if err != nil {
        log.Fatal("Failed to initialize Firebase:", err)
    }
    router := gin.Default()
    router.GET("/health", handlers.HealthCheck)
    router.POST("/validate-token", handlers.ValidateToken)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8081"
    }
    
    router.Run(":" + port)
}