import "./App.css";
import Grid from "./components/Grid";
import WaterShiftSelector from "./components/WaterShiftSelector";
import AddWaterShiftButton from "./components/AddWaterShiftButton"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedDate from "./components/formattedDate";
import History from "./components/History";

const App: React.FC = () => {
    return (
    <div>
      <h1 className="!text-5xl !inset-x-0 !top-10 !absolute">Gestión de Turnos de Riego</h1>
      <div className="flex gap-2 flex-row items-center pb-5">
      <WaterShiftSelector />
      <AddWaterShiftButton />
      <FormattedDate />
      <History />
      </div>  
      <Grid />
      <ToastContainer theme="dark"/>
    </div>
  );
};

export default App;