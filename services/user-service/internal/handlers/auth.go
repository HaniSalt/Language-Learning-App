package handlers

import (
	"context"
	"net/http"
	"user-service/internal/firebase"
	// "log"
	"github.com/gin-gonic/gin"
)
type TokenRequest struct {
	Token string `json:"token" binding:"required"`
}

func ValidateToken(c *gin.Context) {
	/*body, _ := c.GetRawData()
	log.Printf("Received message: %+v", string(body))*/
	var req TokenRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		//log.Printf("Binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "token required"})
		//log.Printf("token: %s", req.Token)
		return
	}
	//log.Printf("token: %s", req.Token)

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