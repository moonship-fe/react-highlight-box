import './App.css';
import {CodeHighlight} from "./CodeHighlight";


function App() {
    const source = `ArrayBuffer.isView()`;

    return (
    <div className="App">
        <CodeHighlight source={source} lang={'js'}/>
    </div>
  );
}

export default App;
