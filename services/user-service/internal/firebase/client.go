package firebase
import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)
var firebaseApp *firebase.App
func InitFirebase() error {
	credPath := os.Getenv("FIREBASE_CREDENTIALS_PATH")
	if credPath == "" {
		log.Fatal("FIREBASE_CREDENTIALS_PATH not set")
	}

	opt := option.WithCredentialsFile(credPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return err
	}

	firebaseApp = app
	log.Println("Firebase initialized")
	return nil
}
func GetAuthClient() (*auth.Client, error) {
	client, err := firebaseApp.Auth(context.Background())
	if err != nil {
		return nil, err
	}
	return client, nil
}