import { Provider } from "react-redux";
import "./App.css";
import Grid from "./components/Grid";
import WaterShiftSelector from "./components/WaterShiftSelector";
import DateRangeSelector from "./components/DateRangeSelector";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Gestión de Turnos de Riego</h1>
        <WaterShiftSelector />
        <DateRangeSelector />
        <Grid />
      </div>
    </Provider>
  );
};

export default App;
