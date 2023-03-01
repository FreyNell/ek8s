import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Pod from './components/Pod';

function App() {
	const [namespaces,setNamespaces] = useState([]);
	
	window.k8s.receiveContexts((_event,value)=>setNamespaces(value));

	function getContexts(){
		window.k8s.getContexts();
	}

	useEffect(()=>{
	},[namespaces]);
  return (
    <div className="App">
	  <Pod></Pod>
	  <button onClick={()=>getContexts()}>Contexts</button>
	  {namespaces.map((x,i)=><div key={"namespace"+i}>{x.cluster}</div>)}
	</div>

  );
}

export default App;

