import { feedback } from "./feedback"
import { login } from "./login"
import { register } from "./register"
import { send_verifyEmail } from "./send_verifyEmail"
import { validateEmail } from "./validateEmail"

export const useAuth = {
    login,
    register,
    feedback,
    validateEmail,
    send_verifyEmail
}