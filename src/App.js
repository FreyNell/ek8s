import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Pod from './components/Pod';

function App() {
	const [contexts, setContexts] = useState([]);
	const [currentContext, setCurrentContext] = useState("");
	const [namespaces,setNamespaces] = useState([]);

	function getContexts(){
		window.k8s.getContexts();
	}

	function getCurrentContext(){
		window.k8s.getCurrentContext();
	}

	useEffect(()=>{
		window.k8s.renderContexts((_event,value)=>setContexts(value));
		window.k8s.renderCurrentContext((_event,value)=>setCurrentContext(value));
		getContexts();
		getCurrentContext();
	},[]);

	return (
    	<div className="App">
			<h3 className="CurrentContext">{currentContext}</h3>
	  		<Pod></Pod>
	  		{namespaces.map((x,i)=><div key={"namespace"+i}>{x.cluster}</div>)}
	  		<button onClick={()=>getContexts()}>tap</button>
		</div>
  	);
}

export default App;

