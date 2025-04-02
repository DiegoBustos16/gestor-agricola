import "./App.css";
import Grid from "./components/Grid";
import WaterShiftSelector from "./components/WaterShiftSelector";
import AddWaterShiftButton from "./components/AddWaterShiftButton"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import FormattedDate from "./components/FormattedDate";
import History from "./components/History";
import HistoryFilter from "./components/HistoryFilter";

const App: React.FC = () => {
  const viewMode = useSelector((state: RootState) => state.waterShift.viewMode);

  return (
    <div className="p-4">
      <h1 className="!text-2xl md:!text-4xl text-center mb-4 md:!inset-x-0 md:!top-10 md:!absolute">Gestión de Turnos de Riego</h1>
      
      {viewMode === "current" ? (
        <div className="flex md:hidden justify-center mb-2">
        <FormattedDate />
        </div>
        ) : (<></>
      )}

      <div className="flex flex-row gap-2 items-center pb-5 justify-between">
      {viewMode === "current" ? (
          <>   
          <div className="flex flex-row gap-2 items-center">
            <WaterShiftSelector />
            <AddWaterShiftButton />
          </div>
            
            <div className="hidden md:block">
              <FormattedDate />
            </div>
          </>
        ) : (
          <HistoryFilter />
        )}
        <History />
      </div>
      <Grid />
      <ToastContainer theme="dark" />
    </div>
  );
};

export default App;
