package main

import (
    "log"
    "os"
    "internal/firebase"
    "internal/handlers"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using system env variables")
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