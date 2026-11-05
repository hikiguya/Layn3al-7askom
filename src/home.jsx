import "./home.css";
import Qui from "./App"; 
import { Link, BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import CreateLink from "./CreateLink";
import Join from "./Join";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function ResultsSidebar() {
  const [quizName, setQuizName] = useState("");
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  const loadResults = () => {
    if (!quizName.trim()) return;
    setSearched(true);
    const q = query(
      collection(db, "quizzes", quizName.trim(), "results"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setResults(data);
      if (data.length > 0) setSelectedId(data[0].id);
      else setSelectedId("");
    });
    return unsub;
  };

  const selected = results.find(r => r.id === selectedId);

  return (
    <>

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          background: "linear-gradient(90deg, #FF9A3D 0%, #FF6B6B 100%)",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: 20,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(255,107,107,0.35)"
        }}
      >
        {open ? "Close Results ✕" : "Results 🏆"}
      </button>

     
      {open && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "320px",
          maxWidth: "90vw",
          height: "100vh",
          background: "#fff",
          zIndex: 99,
          padding: 20,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
          overflowY: "auto",
          boxSizing: "border-box"
        }}>
          <h3 style={{ color: "#1A1A1A", marginTop: 40 }}>See Results 🏆</h3>
          <p style={{ color: "#666", fontSize: 13 }}>Enter your quiz name to see who answered you.</p>

          <label style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13 }}>Your Quiz Name</label>
          <input
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Example: Adam"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #FFE8C8", background: "#FFFBF0", marginTop: 6, boxSizing: "border-box", outline: "none" }}
          />
          <button
            onClick={loadResults}
            style={{ width: "100%", marginTop: 10, background: "linear-gradient(90deg, #FF9A3D 0%, #FF6B6B 100%)", color: "#fff", border: "none", padding: 12, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Show Results
          </button>

          {searched && (
            <>
              <label style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13, display: "block", marginTop: 20 }}>Select Player</label>
              {results.length === 0 ? (
                <p style={{ color: "#666", fontSize: 14 }}>No one has answered this quiz yet.</p>
              ) : (
                <>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #FFE8C8", background: "#FFFBF0", marginTop: 6, fontSize: 15, outline: "none" }}
                  >
                    {results.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.playerName} - {r.score}/{r.total} ({r.percent}%)
                      </option>
                    ))}
                  </select>

                  {selected && (
                    <div style={{ background: "#FFFBF0", border: "1px solid #FFE8C8", borderRadius: 16, padding: 16, marginTop: 15 }}>
                      <h4 style={{ margin: "0 0 8px", color: "#1A1A1A" }}>{selected.playerName}</h4>
                      <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#FF6B6B" }}>{selected.score} / {selected.total}</p>
                      <p style={{ margin: "4px 0 0", color: "#666" }}>{selected.percent}% correct</p>
                      <p style={{
                        marginTop: 10,
                        background: selected.percent >= 80 ? "#E8F8F0" : selected.percent >= 50 ? "#FFFBF0" : "#FDECEC",
                        color: selected.percent >= 80 ? "#22C77A" : selected.percent >= 50 ? "#FF9A3D" : "#FF5555",
                        padding: "8px 12px",
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: 13,
                        textAlign: "center"
                      }}>
                        {selected.percent >= 80 ? "You're dope! 🔥" : selected.percent >= 50 ? "You're alright! 👍" :   "Bro, did you even try? 💀"}
                      </p>

                    
                      <div style={{ marginTop: 15 }}>
                        <b style={{ fontSize: 13, color: "#1A1A1A" }}>All Results ({results.length})</b>
                        {results.map((r) => (
                          <div key={r.id} onClick={() => setSelectedId(r.id)} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FFE8C8", cursor: "pointer", fontWeight: r.id === selectedId ? 700 : 400 }}>
                            <span>{r.playerName}</span>
                            <span>{r.score}/{r.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

function HomeContent(){
    const [val,setVal]=useState("")
    const [url,setUtl]=useState(true)
    const [err,setErr]=useState("")
    const navigate = useNavigate()
    
  return(
    <div className="home-container">
      <ResultsSidebar />

       <header className="game-header">
        <div className="cat-card">
          <img src="/cat.jpg" alt="cat" className="cat-img" />
          <span className="cat-name">Layn3al_7askom</span>
        </div>
      </header>

        <div className="home-card">
          <div className="input-group">
            <label>Your Name</label>
            <input type="text" placeholder="Insert Your Name ..." onChange={(e)=>{setVal(e.target.value)}}/>
          </div>
           <span className="error-msg">{err}</span>
          <div className="features">
            <div className="feature"><span>📝</span><p>Create Questions</p></div>
            <div className="feature"><span>🔗</span><p>Share Link</p></div>
            <div className="feature"><span>🏆</span><p>See Results</p></div>
          </div>

         <button onClick={()=>{
  if(!val.trim()){
    setErr("Insert Your Name")
    return
  }
  setErr("")

  
  const randomCode = Math.floor(1000 + Math.random() * 9000);

  // smiya + code - ex: Adam-4821
  const finalName = `${val.trim()}-${randomCode}`;


  localStorage.setItem("myQuizName", finalName);
  localStorage.setItem("myCode", randomCode);

  navigate(`/Quis/${finalName}`)
}} className="go-btn">
  Let's Go...
</button>

          <div className="how-to-play">
            <h4>How to Play?</h4>
            <ul>
              <li>1. Enter your name</li>
              <li>2. Create 10 questions about you</li>
              <li>3. Share link with friends</li>
            </ul>
          </div>
        </div>

        <footer className="home-footer">
          <p>🔥 12k+ games created today</p>
        </footer>
    </div>
  )
}

function Home(){
    return(
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeContent/>} />
            <Route path="/Quis/:val" element={<Qui/>} />
            <Route path="/Links/:val" element={<CreateLink/>} />
            <Route path="/join/:val" element={<Join/>} />
          </Routes>
        </BrowserRouter>
    )
}
export default Home