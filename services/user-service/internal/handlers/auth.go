func VerifyIDToken(context, token){

}

Goal: Accept token, return UID or error

Handler ValidateToken:
    1. Parse JSON body to get token string //which json? fireabase credentials? What to get?
    2. Get Firebase auth client // how
    3. Call VerifyIDToken(context, token) //whats context here?
    4. If error: return 401 Unauthorized
    5. If success: return 200 with UID