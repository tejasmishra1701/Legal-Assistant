import { useAuth } from '../../context/AuthContext'
import Login from '../../components/Auth/Login'

export default function LoginPage() {
  const { login } = useAuth()
  
  return (
    <div>
      <Login onLoginSuccess={(token) => login(token)} />
    </div>
  )
}