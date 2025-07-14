import { useNavigate } from 'react-router-dom'
import Signup from '../../components/Auth/Signup'

export default function SignupPage() {
  const navigate = useNavigate()
  
  const handleSignupSuccess = () => {
    // Redirect to login page after successful registration
    navigate('/login')
  }
  
  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Signup onSignupSuccess={handleSignupSuccess} />
    </div>
  )
}