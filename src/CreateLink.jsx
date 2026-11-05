import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function CreateLink(){
  const { val } = useParams();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
 

  const createLink = () => {
    const finalLink = `${window.location.origin}/join/${val}`;
    setLink(finalLink);
    setCopied(false);
  };

  const handleCopy = () => {
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(link);
    } else {
      // فالتيليفون
      let textArea = document.createElement("textarea");
      textArea.value = link;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand('copy'); } catch(e){}
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  // بوطون كيصيفط لانستا
  const shareToInsta = () => {
    handleCopy(); // كيكوبي ليان بعدا كيحل انستا
    setTimeout(()=>{
      window.open("https://www.instagram.com/", "_blank");
    }, 300);
  }

  return(
    <div className="game-container">
      <header className="game-header">
        <div className="cat-card">
          <img src="/cat.jpg" alt="cat" className="cat-img"/>
          <span className="cat-name">Layn3al_7askom</span>
        </div>
      </header>
      <br /><br />

      <div className="game-card">
        <div className="card-badge">YOUR LINK</div>

        <button className="save-btn" onClick={createLink}>
          <span>Make it Lien</span> <span>🔗</span>
        </button>

        {link && (
          <div style={{marginTop:20, display:"flex", flexDirection:"column", gap:10}}>
            <p style={{wordBreak:"break-all", background:"#222", padding:12, borderRadius:8, color:"#fff", textAlign:"center", margin:0}}>{link}</p>
            
            <button className="save-btn" onClick={handleCopy}>
              {copied ? "Copy Link ✅" : 'Copy Link ...'}
            </button>

            <button 
              className="save-btn insta-btn" 
              style={{
          marginTop:15,
          background:"linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
          textDecoration:"none",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          gap:8
              }}
              onClick={shareToInsta}
            >
              Send Link in Instgram
            </button>
            
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateLink;