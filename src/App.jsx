import { Route,Routes } from "react-router-dom"
import Home from "./components/Home"

function App() {

  return (
    <div className="bg-[#1F1E24] text-white w-screen h-screen">
      <Routes>
          <Route path='/' element={<Home></Home>} />
      </Routes>
    </div>
  )
}

export default App
