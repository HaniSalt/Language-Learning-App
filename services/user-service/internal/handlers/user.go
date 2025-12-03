package handlers

import (
	"context"
	"net/http"
	"user-service/internal/firebase"

	"github.com/gin-gonic/gin"
)

func GetUserProfile(c *gin.Context) {
	uid := c.Param("uid")
	if uid == ""{
		c.JSON(http.StatusBadRequest, gin.H{"error": "uid required"})
		return
	}

	authClient, err := firebase.GetAuthClient()
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error": "firebase error"})
		return
	}

	user, err := authClient.GetUser(context.Background(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"uid":           user.UID,
		"email":         user.Email,
		"displayName":   user.DisplayName,
		"emailVerified": user.EmailVerified,
	})
}