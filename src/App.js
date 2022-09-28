import {useState} from "react";
import "./Reset.css";
import "./Style.css";
import forca0 from "./forca0.png";
import forca1 from "./forca1.png";
import forca2 from "./forca2.png";
import forca3 from "./forca3.png";
import forca4 from "./forca4.png";
import forca5 from "./forca5.png";
import forca6 from "./forca6.png";
import alfabeto from "./Letras";
import palavras from "./Palavras";
let palavraSorteada;
let palavraEscolhida;
let palavraLimpa;
let qteErros;
let nErros = 0;
let letrasTentadas;

export default function App(){    
    let palavraFoiEscolhida = false;
    const [estiloPalavraFinal, setEstiloFinal] = useState("");
    const [escolhida, setEscolhida] = useState([]);
    const [letraS, setLetrasClicadas] = useState([]); //Recebe todas as letras clicadas
    const [jogavel, setJogo] = useState("desabilitado");
    const [chuteP, setChuteP] = useState("");        
    const [iniciarJogo, setInicioJogo] = useState(palavraFoiEscolhida);
    const [contador, setContador] = useState(nErros);
    const [imagem, setImagem] = useState(forca0)
    const [letrasCerta, setLetrasCerta] = useState([]);
    const [palavraFim, setPalavraFim] = useState([]);
    //Escolhe a palavra e habilita o jogo
    function EscolherPalavra(){        
        palavraSorteada = palavras[Math.floor(Math.random() * palavras.length)]; //Escolhe uma palavra do array palavras
        palavraLimpa = palavraSorteada.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        palavraEscolhida = [...palavraLimpa];      
        letrasTentadas = []  
        setContador(0)
        setLetrasClicadas([])
        //setLetrasCerta([])
        setImagem(forca0)
        setEstiloFinal("")
        setPalavraFim([])
        setEscolhida( palavraEscolhida)
        let inicio = true;
        setInicioJogo(inicio)
        setJogo("habilitado")
    }
    //Verifica a imagem da forca e erros
    function Erros(qteErros){
        qteErros = contador +1;
        setContador(qteErros)
        if(qteErros === 1){setImagem(forca1)    
        } if(qteErros === 2){setImagem(forca2)
        } if(qteErros === 3){setImagem(forca3)
        } if(qteErros === 4){setImagem(forca4)
        } if(qteErros === 5){setImagem(forca5)
        } if(qteErros === 6){
            setImagem(forca6) 
            perdeu()}
    }
       
    //INPUT
    function InserirInput(){
        return(<>
        <label>Já sei a palavra!</label>
        <input type="text" value={chuteP} autoFocus onChange={e => setChuteP(e.target.value)}></input>
        <button className={`${jogavel}`} onClick={iniciarJogo ? (fazerChute) : (() => alert("Você errou! Clique em Escolha uma Palavra para iniciar o jogo"))}>Chutar!</button> </>)
    }
    //VERIFICAR O CHUTE
    function fazerChute(){
        let testeChuteL = chuteP.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        let testeChute = [...testeChuteL]
        if(JSON.stringify(testeChute)===JSON.stringify(palavraEscolhida)){  
            setEscolhida([])
            setPalavraFim(palavraEscolhida)
            ganhou()          
            alert("Você ganhou!")
        } else {
            setImagem(forca6)
            setEscolhida([])
            setPalavraFim(palavraEscolhida)
            perdeu()
            alert("Voce foi enforcado!")
        }
    }
    
    function perdeu(){
        let terminado = false
        setContador(0)
        setEscolhida([])
        setInicioJogo(terminado)
        setPalavraFim(palavraEscolhida)
        setJogo("desabilitado")
        let jogo = "perdeu"
        setEstiloFinal(jogo)
    }
    function ganhou(letrasEscolhidasFiltrada, escolhidaFiltrada){
        if(escolhidaFiltrada.length === letrasCerta.length){
            let teste1 = escolhidaFiltrada.sort()
            let teste2 = letrasEscolhidasFiltrada.sort()
            if(teste1 === teste2){
                setImagem(forca0)
                setPalavraFim(palavraEscolhida)
                setContador(0)
                setEscolhida([])
                let terminado = false
                setInicioJogo(terminado)
                setJogo("desabilitado")
                let jogo = "ganhou"
                setEstiloFinal(jogo)
                } }          
    }
    //Renderiza a tela
    return (<div>
    <div className="faixaSuperior">
        <img src={imagem} alt="" />
        <button onClick={EscolherPalavra}>Escolher Palavra</button>
        <ul className={`palavra ${estiloPalavraFinal}`}>{palavraFim}{escolhida.map((l, index) => (<li key={index}><div><p>{letrasCerta.includes(l) ? (l) : "_" }</p></div></li>))}</ul></div>
    <ul className="teclado"><InserirLetras 
    jogavel={jogavel} 
    letraS={letraS}
    iniciarJogo={iniciarJogo}
    setLetrasClicadas={setLetrasClicadas}
    letrasCerta={letrasCerta}
    ganhou={ganhou}
    setLetrasCerta={setLetrasCerta}
    Erros={Erros}
     /></ul>      
    <div className="chute"><InserirInput /></div>
    </div>
    )
}

//Renderiza as letras do alfabeto
function InserirLetras(props){
    //Conferir letras
    function confereLetras(l){
        if(palavraEscolhida.includes(l)){     
            letrasTentadas = [...props.letraS, l];
            props.setLetrasClicadas(letrasTentadas);
            let tentativaCerta = [...props.letrasCerta, l]
            props.setLetrasCerta(tentativaCerta);
            let letrasEscolhidasFiltrada = [...new Set(props.letrasCerta)]
            let escolhidaFiltrada = [...new Set(palavraEscolhida)]
            props.ganhou(letrasEscolhidasFiltrada, escolhidaFiltrada)      
        } else {         
            letrasTentadas = [...props.letraS, l];
            props.setLetrasClicadas(letrasTentadas);
            props.Erros()
        }      
    }
    return (<>
        {alfabeto.map((l, index) => <li key={index} 
        className={`tecladoL ${props.jogavel}  ${props.letraS.includes(l) ? "desabilitado" : ""}`} 
        onClick={props.iniciarJogo ? (() => confereLetras(l)) : (() => 
        alert("Escolha uma Palavra para iniciar o jogo"))}>{l}</li>)}
    </>)
}
