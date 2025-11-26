Goal: Create a function that returns Firebase Auth client
var firebaseApp *firebase.App // does this really need to be a reference?
func InitFirebase()
{
    firebaseApp:= godotenv.Load()
        if  firebaseApp!= nil 
        {
            log.Println("No .env file found")
        }   
    return nil
}

func GetAuthClient(){
    App.Auth(context.Background()) //why this and how to continue?
}

Function InitFirebase():
    1. Read environment variable for credentials path
    2. Create Firebase app with credentials file
    3. Store app in global variable
    4. Return nil (no error) or error

Function GetAuthClient():
    1. Get auth client from Firebase app
    2. Return client or error