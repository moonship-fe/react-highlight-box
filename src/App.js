import './App.css';
import {CodeHighlight} from "./CodeHighlight";


function App() {
    const source = `
    const element = document.getElementById('some-element-you-want-to-animate');
let start;

function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;

  element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

  if (elapsed < 2000) { // 在两秒后停止动画
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step); 
    `;

    return (
    <div className="App">
        <CodeHighlight source={source} lang={'js'}/>
    </div>
  );
}

export default App;
