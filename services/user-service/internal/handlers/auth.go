package handlers

import (
	"context"
	"net/http"
	"user-service/internal/firebase"

	"github.com/gin-gonic/gin"
)
type TokenRequest struct {
	Token string `json:"token" binding:"required"`
}

func ValidateToken(c *gin.Context) {
	var req TokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token required"})
		return
	}
	authClient, err := firebase.GetAuthClient()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "firebase error"})
		return
	}
	token, err := authClient.VerifyIDToken(context.Background(), req.Token)
	
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}
    
	c.JSON(http.StatusOK, gin.H{
		"uid": token.UID,
	})
}