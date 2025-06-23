import { SeatingChartProvider } from './context/SeatingChartContext';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <SeatingChartProvider>
      <Layout />
    </SeatingChartProvider>
  );
}

export default App;