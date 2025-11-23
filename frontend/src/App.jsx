import { useState } from 'react';
import SearchForm from './components/searchForm';
import Results from './components/results';

function App() {
  const [results, setResults] = useState([]);
  return (
    <div style={{padding:20}}>
      <h1>Doctor Recommendation</h1>
      <SearchForm onResults={setResults} />
      <Results list={results} />
    </div>
  );
}

export default App;
