import { Container } from '@mui/material'
import { TaskBoard } from './features/tasks/TaskBoard.jsx'

function App() {
  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        px: 0,
      }}
    >
      <TaskBoard />
    </Container>
  )
}

export default App
