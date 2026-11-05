import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Colors from your game - nafs l alwan dyal tswira
const C = {
  bg: "linear-gradient(180deg, #FF8A3D 0%, #FF6B6B 45%, #A8D8EA 100%)",
  card: "#FFFFFF",
  inputBg: "#FFFBF0",
  inputBorder: "#FFE8C8",
  orange: "#FF9A3D",
  coral: "#FF6B6B",
  btnGradient: "linear-gradient(90deg, #FF9A3D 0%, #FF6B6B 100%)",
  instaGradient: "linear-gradient(90deg, #FFD93D 0%, #FF6B9D 50%, #7B61FF 100%)",
  black: "#1A1A1A",
  gray: "#666666",
  label: "#FF6B6B",
  greenBg: "#E8F8F0",
  green: "#22C77A",
  redBg: "#FDECEC",
  red: "#FF5555",
};

function shuffleArray(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Join(){
  const { val } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(()=>{
    const fetchQ = async () => {
      const snap = await getDoc(doc(db, "quizzes", val));
      if(snap.exists()){
        setQuestions(snap.data().questions);
      }
      setLoading(false);
    }
    fetchQ();
  },[val]);

  const shuffledQuestions = useMemo(()=>{
    return questions.map(q => ({
      ...q,
      options: shuffleArray([q.op1, q.op2, q.op3, q.op4])
    }));
  }, [questions]);

  const getScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      const correct = q.correct || q.op1;
      if(answers[i] === correct) score++;
    });
    return score;
  };

  // 👇 هادي هي اللي زدنا - كتسجل النتيجة 👇
  const handleFinish = async () => {
    if (!answers[current]) return;
    setFinished(true);

    try {
      const score = getScore();
      await addDoc(collection(db, "quizzes", val, "results"), {
        playerName: playerName,
        score: score,
        total: questions.length,
        percent: Math.round((score / questions.length) * 100),
        answers: answers,
        createdAt: serverTimestamp(),
      });
      console.log("Result saved for:", val, playerName);
    } catch (e) {
      console.log("Error saving result:", e);
    }
  };

  if(loading) return <p style={{textAlign:'center', marginTop: 60}}>Loading...</p>
  if(questions.length === 0) return <p style={{textAlign:'center', marginTop: 60}}>No quiz found for {val} 😢</p>

  // PAGE 1 - SMIYA
  if(!started) return (
    <div className="game-container" style={{background: C.bg, minHeight: "100vh", paddingBottom: 20}}>
      <header className="game-header">
        <div className="cat-card">
          <img src="/cat.jpg" alt="cat" className="cat-img"/>
          <span className="cat-name">Layn3al_7askom</span>
        </div>
      </header>

      <div className="game-card" style={{marginTop:20, textAlign:'center', background: C.card}}>
        <div className="card-badge" style={{background: C.orange}}>{val.toUpperCase()}'S QUIZ 🎮</div>
        <h2 style={{color: C.black}}>Who are you? 👀</h2>
        <p style={{color: C.gray}}>Enter your name to start playing</p>
        <input
          value={playerName}
          onChange={(e)=> setPlayerName(e.target.value)}
          placeholder="Type your name here..."
          style={{width:'100%', padding:14, borderRadius:12, border:`1px solid ${C.inputBorder}`, background: C.inputBg, color: C.black, fontSize:16, textAlign:'center', boxSizing:'border-box', outline:'none'}}
          onKeyDown={(e)=> { if(e.key === 'Enter' && playerName.trim()) setStarted(true) }}
        />
        <button className="save-btn" style={{marginTop:15, width:'100%', background: C.btnGradient, color:"#fff", fontWeight:700, boxShadow:"0 8px 20px rgba(255,107,107,0.35)", opacity: playerName.trim() ? 1 : 0.5}} onClick={()=> { if(playerName.trim()) setStarted(true) }}>
          Start Playing 
        </button>
      </div>
    </div>
  )

  // PAGE 2 - RESULTAT
  if(finished) {
    const score = getScore();
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="game-container" style={{background: C.bg, minHeight: "100vh", paddingBottom: 20}}>
        <header className="game-header">
          <div className="cat-card">
            <img src="/cat.jpg" alt="cat" className="cat-img"/>
            <span className="cat-name">Layn3al_7askom</span>
          </div>
        </header>
        <div className="game-card" style={{textAlign:'center', marginTop:20, background: C.card}}>
          <div className="card-badge" style={{background: C.orange}}>FINISHED 🎉</div>
          <h2 style={{color: C.black}}>Well done {playerName} ✅</h2>
          <h1 style={{fontSize:52, margin:'10px 0', color: C.coral}}>{score} / {questions.length}</h1>
          <p style={{fontSize:20, color: C.black, margin: 0}}>You got {percent}%</p>
          <p style={{color: C.gray}}>{percent >= 80 ? "You're dope! 🔥" : percent >= 50 ?"You're alright! 👍"  :  "Bro, did you even try? 💀"}</p>
          
          <div style={{textAlign:'left', marginTop:20}}>
            {questions.map((q, i)=>{
              const correct = q.correct || q.op1;
              const isRight = answers[i] === correct;
              return (
                <div key={q.id} style={{background: isRight ? C.greenBg : C.redBg, padding:12, borderRadius:12, marginBottom:8, border: `1px solid ${isRight ? C.green : C.red}`}}>
                  <b style={{color: C.black}}>{i+1}. {q.Ask}</b>
                  <p style={{margin:'6px 0 0', fontSize:13, color: C.black}}>Your answer: {answers[i]} {isRight ? '✅' : '❌'}</p>
                  {!isRight && <p style={{margin:'4px 0 0', fontSize:13, color: C.green}}>Correct answer: {correct}</p>}
                </div>
              )
            })}
          </div>
          <a href="/" className="save-btn" style={{display:'block',width:'90%', textDecoration:'none', marginTop:15, background: C.btnGradient, color:"#fff", fontWeight:700}}>Create Your Quiz 🔗</a>
        </div>
      </div>
    )
  }

  // PAGE 3 - AS2ILA
  const q = shuffledQuestions[current];
  const options = q.options;
  const progress = ((current) / questions.length) * 100;

  return(
    <div className="game-container" style={{background: C.bg, minHeight: "100vh", paddingBottom: 20}}>
      <header className="game-header">
        <div className="cat-card">
          <img src="/cat.jpg" alt="cat" className="cat-img"/>
          <span className="cat-name">Layn3al_7askom</span>
        </div>
      </header>

      <div className="welcome-box" style={{background: C.card, color: C.black}}>
        <span style={{color: C.coral}}>{val}</span>'s Quiz 🎮 - Player: <span style={{color: C.coral}}>{playerName}</span>
      </div>

      <div style={{background: "#fff", height:10, borderRadius:20, margin:'15px 0', overflow:'hidden'}}>
        <div style={{background: C.btnGradient, height:'100%', width:`${progress}%`, transition:'0.3s'}}></div>
      </div>
      <p style={{textAlign:'center', color: '#fff', margin:0, fontWeight:600}}>Question {current+1} / {questions.length}</p>

      <div className="game-card" style={{marginTop:15, background: C.card}}>
        <div className="card-badge" style={{background: C.orange}}>QUESTION {current+1}</div>
        <h3 style={{textAlign:'center', fontSize:22, color: C.black}}>{q.Ask}</h3>
        
        <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:20}}>
          {options.map((op, idx)=>{
            const selected = answers[current]===op;
            return (
              <button 
                key={idx} 
                className="save-btn" 
                style={{
                  background: selected ? C.btnGradient : C.inputBg, 
                  color: selected ? '#fff' : C.black,
                  border: selected ? `1px solid ${C.coral}` : `1px solid ${C.inputBorder}`,
                  fontWeight: selected ? 700 : 400,
                  boxShadow: selected ? "0 6px 15px rgba(255,107,107,0.3)" : "none",
                }} 
                onClick={()=> setAnswers({...answers, [current]: op})}
              >
                {['A','B','C','D'][idx]} - {op}
              </button>
            )
          })}
        </div>

        <div style={{marginTop:20}}>
          {current < questions.length-1 ? (
            <button 
              className="save-btn" 
              style={{width:'100%', background: C.btnGradient, color:"#fff", fontWeight:700, boxShadow:"0 8px 20px rgba(255,107,107,0.35)", opacity: answers[current] ? 1 : 0.5}} 
              onClick={()=> { if(answers[current]) setCurrent(current+1) }}
            >
              Next Question 
            </button>
          ) : (
            <button 
              className="save-btn" 
              style={{width:'100%', background: C.btnGradient, color:'#fff', fontWeight:700, boxShadow:"0 8px 20px rgba(255,107,107,0.35)", opacity: answers[current] ? 1 : 0.5}} 
              onClick={handleFinish}
            >
              Finish ✅
            </button>
          )}
        </div>
       
      </div>
    </div>
  )
}
export default Join;