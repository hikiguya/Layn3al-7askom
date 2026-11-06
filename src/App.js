import { Link, useParams } from 'react-router-dom';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function Qui(props) {
  const [elem, setEleme] = useState([{ id: "", Ask: "", op1: "", op2: "", op3: "", op4: "" }])
  const [mess, setMess] = useState("")
  const Asking = useRef()
  const opt1 = useRef()
  const opt2 = useRef()
  const opt3 = useRef()
  const opt4 = useRef()
  const [showConfirm, setShowConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const { val } = useParams()
  const [isDone, setIsDone] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Mli t-clicki 3la modify, 3mer les inputs MORa l-re-render
  useEffect(() => {
    if (editingQuestion) {
      Asking.current.value = editingQuestion.Ask;
      opt1.current.value = editingQuestion.op1;
      opt2.current.value = editingQuestion.op2;
      opt3.current.value = editingQuestion.op3;
      opt4.current.value = editingQuestion.op4;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingQuestion]);

  const handlerBottun = async () => {
    if (!Asking.current.value.trim() || !opt1.current.value.trim() || !opt2.current.value.trim() || !opt3.current.value.trim() || !opt4.current.value.trim()) {
      setMess(" Question Or Option Empte !!")
      return;
    }

    setMess("")
    const newQuestion = {
      id: editingId ? editingId : Date.now(),
      Ask: Asking.current.value,
      op1: opt1.current.value,
      op2: opt2.current.value,
      op3: opt3.current.value,
      op4: opt4.current.value
    }

    const updated = [...elem.filter(f => f.Ask), newQuestion]
    setEleme(updated)
    await setDoc(doc(db, "quizzes", val), { questions: updated, owner: val })

    Asking.current.value = "";
    opt1.current.value = "";
    opt2.current.value = "";
    opt3.current.value = "";
    opt4.current.value = "";
    setEditingId(null);
    setEditingQuestion(null);

    setIsDone(updated.length >= 3)
  }

  const handleEdit = (f) => {
    setEditingId(f.id);
    setEditingQuestion(f);
    setEleme(elem.filter(u => u !== f).filter(x => x.Ask));
  }

  const handleDelete = async () => {
    const newList = elem.filter(u => u !== itemToDelete);
    const cleanList = newList.filter(f => f.Ask);
    setEleme(cleanList);
    await setDoc(doc(db, "quizzes", val), { questions: cleanList, owner: val });
    setIsDone(cleanList.length >= 6);
    setShowConfirm(false);
    setItemToDelete(null);
  }

  const cancelEdit = () => {
    // ila kan kay-modifi w bgha y-laghi, rje3 l-question l-liste
    if (editingQuestion) {
      const restored = [...elem.filter(f => f.Ask), editingQuestion];
      setEleme(restored);
      setIsDone(restored.length >= 3);
    }
    Asking.current.value = "";
    opt1.current.value = "";
    opt2.current.value = "";
    opt3.current.value = "";
    opt4.current.value = "";
    setEditingId(null);
    setEditingQuestion(null);
    setMess("");
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="cat-card">
          <img src="/cat.jpg" alt="cat" className="cat-img" />
          <span className="cat-name">Layn3al_7askom</span>
        </div>
      </header>
      <div className="welcome-box">
        Welcome <span>{val}</span> ...
      </div><br></br>
      <div className="game-card">
        <div className="card-badge">NEW QUIZ</div>

        <div className="input-group">
          <label>Your Question</label>
          <input className="input-question" type="text" placeholder="Insert Your Question" ref={Asking} />
          <p className='error-msg'>{mess}</p>
        </div>

        <div className="options">
          <div className="input-group">
            <label>Options</label>
            <input ref={opt1} placeholder="✅ Correct Answer - Option 1 ..." />
          </div>
          <input type="text" placeholder="Option B ..." ref={opt2} />
          <input type="text" placeholder="Option C ..." ref={opt3} />
          <input type="text" placeholder="Option D ..." ref={opt4} />
        </div>

        <button className="save-btn" onClick={handlerBottun}>
          <span>{editingId ? "Update Question ✏️" : "Save Question"}</span>
          <span className="btn-icon">✅</span>
        </button>

        {editingId && (
          <button className="save-btn" onClick={cancelEdit} style={{ background: "#888", marginTop: "10px" }}>
            <span>Cancel Edit ❌</span>
          </button>
        )}

        <Link
          to={isDone ? `/Links/${val}` : "#"}
          className={`sav-btn ${isDone ? 'active' : 'inactive'}`}
          onClick={(e) => !isDone && e.preventDefault()}
        >
          <span>Tek Your link 🔗</span>
        </Link>
      </div><br></br>

      <div className="saved-questions">
        {elem.filter(f => f.Ask).map((f) =>
          <div key={f.id || f.Ask} className="question-item">
            {f.Ask}
            <button onClick={() => {
              setItemToDelete(f)
              setShowConfirm(true)
            }}>✖️</button>
            <button onClick={() => handleEdit(f)}>✏️</button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>واش متأكد؟</h3>
            <p>بغيتي تمسح: "{itemToDelete?.Ask}"</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => {
                setShowConfirm(false)
                setItemToDelete(null)
              }}>لا</button>

              <button className="btn-confirm" onClick={handleDelete}>آه، مسح</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Qui