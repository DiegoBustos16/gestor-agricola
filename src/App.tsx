import "./App.css";
import Grid from "./components/Grid";
import WaterShiftSelector from "./components/WaterShiftSelector";
import DateRangeSelector from "./components/DateRangeSelector";
import AddWaterShiftButton from "./components/AddWaterShiftButton"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <div>
      <h1>Gestión de Turnos de Riego</h1>
      <WaterShiftSelector />
      <DateRangeSelector />
      <AddWaterShiftButton />
      <Grid />
      <ToastContainer theme="dark"/>
    </div>
  );
};

export default App;