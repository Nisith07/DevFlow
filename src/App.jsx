import Providers from '@/app/providers'
import AppRouter from '@/app/router'
import CustomCursor from '@/shared/components/CustomCursor'

function App() {
  return (
    <Providers>
      <CustomCursor />
      <AppRouter />
    </Providers>
  )
}

export default App
