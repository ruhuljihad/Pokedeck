import React, { useState, useEffect, useRef } from 'react';
import { 
  CircleDollarSign, Dices, LayoutGrid, ChevronLeft, Swords, 
  Trophy, Play, Zap, Loader2, Star, Sparkles, AlertCircle, X, History 
} from 'lucide-react';
import './styles.css';
import gachaVideo from './Assets/Animasi_Kartu_Video_Portrait_.mp4';

const POKE_API_BASE = 'https://pokeapi.co/api/v2/pokemon';

const MOVE_NAMES = ["Power Slash", "Dual Strike", "Elemental Burst", "Sonic Edge", "Final Judgement", "Omega Beam", "Rapid Hit", "Spirit Pulse", "Plasma Cut", "Zenith Strike", "Nova Blast", "Shadow Cloak", "Aura Sphere", "Gravity Well", "Mirage Edge"];
const MOVE_DESCS = ["Serangan elemen murni yang mematikan.", "Memanfaatkan energi alam untuk menghancurkan pertahanan.", "Konon tebasan ini mampu membelah dimensi dan waktu.", "Bergerak secepat kilat, menebas sebelum musuh berkedip.", "Kekuatan kuno yang bangkit dari dalam jiwa kartu.", "Ledakan energi yang sanggup menembus baja sekalipun.", "Mengubah aura sekitar menjadi senjata tajam tak terlihat.", "Cahaya pelangi yang menghapus keberadaan musuh dari arena.", "Satu tebasan yang ditentukan oleh takdir bintang-bintang.", "Presisi tinggi yang mengincar titik lemah terdalam musuh.", "Menciptakan gelombang kejut yang menggetarkan seluruh arena.", "Mengumpulkan tenaga dari inti bumi untuk serangan tunggal.", "Presisi tinggi yang tidak bisa dihindari oleh lawan manapun.", "Serangan cepat yang membawa harmoni dari seluruh elemen.", "Mengubah energi kinetik menjadi ledakan cahaya yang membutakan."];

const getElementIcon = (types) => {
  if (!types || types.length === 0) return "✨";
  const mainType = types[0].toLowerCase();
  if (mainType === 'fire') return "🔥";
  if (mainType === 'water' || mainType === 'ice') return "💧";
  if (mainType === 'electric') return "⚡";
  if (['rock', 'ground', 'steel', 'fighting'].includes(mainType)) return "🪨";
  if (['grass', 'bug', 'flying', 'poison'].includes(mainType)) return "🍃";
  if (['psychic', 'ghost', 'dark', 'fairy', 'dragon'].includes(mainType)) return "🔮";
  return "✨";
};

const TCGCard = ({ poke, size = "small" }) => {
  if (!poke || !poke.name) return null;
  const isLarge = size === "large";
  const rarity = poke.rarity || 'COMMON';
  
  const theme = rarity === 'LEGENDARY' ? { border: 'border-white', bg: 'bg-gradient-to-br from-[#ff0080] via-[#7928ca] to-[#00dfd8] animate-pulse', text: 'text-white', label: 'RAINBOW LEGEND', inner: 'bg-white/20' } :
                rarity === 'RARE' ? { border: 'border-[#D4AF37]', bg: 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728]', text: 'text-[#4a3b00]', label: 'GOLDEN RARE', inner: 'bg-black/10' } :
                { border: 'border-[#cbd5e1]', bg: 'bg-gradient-to-br from-[#94a3b8] via-[#f8fafc] to-[#475569]', text: 'text-slate-800', label: 'SILVER COMMON', inner: 'bg-black/5' };

  // VERSI SUPER AMAN: Menggunakan tanda + untuk menghindari error parser pada template literals
  const baseClasses = "relative flex flex-col rounded-2xl border-[4px] overflow-hidden shadow-2xl mx-auto transition-all duration-500";
  const sizeClasses = isLarge ? "w-[88vw] max-w-[340px] aspect-[7/10] scale-95 origin-top" : "w-full aspect-[7/10] font-black";
  const finalClass = baseClasses + " " + theme.border + " " + theme.bg + " " + theme.text + " " + sizeClasses;

  return (
    <div className={finalClass}>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-50 pointer-events-none"></div>
      <div className={"flex justify-between items-center px-2 border-b border-black/10 " + (isLarge ? "py-2 mb-1.5" : "py-1 mb-1")}>
        <h3 className={(isLarge ? "text-lg" : "text-[9px]") + " capitalize tracking-tighter truncate flex-1 font-black"}>{poke.name}</h3>
        <div className="flex items-center gap-1">
          <span className={(isLarge ? "text-[10px]" : "text-[5px]") + " opacity-70 font-bold"}>HP</span>
          <span className={(isLarge ? "text-xl" : "text-[11px]") + " tabular-nums font-black"}>{Math.floor(poke.hp)}</span>
        </div>
      </div>
      <div className={"mx-2 rounded-xl " + theme.inner + " border border-black/5 flex items-center justify-center p-1 relative overflow-hidden mb-1 shadow-inner " + (isLarge ? "h-[45%]" : "aspect-[4/3]")}>
        {rarity === 'LEGENDARY' && <Sparkles className="absolute inset-0 w-full h-full text-white/30 animate-pulse" />}
        <img src={poke.sprite} className={isLarge ? "h-full object-contain z-10 drop-shadow-2xl scale-125" : "h-full object-contain z-10 drop-shadow-2xl scale-110"} alt={poke.name} />
      </div>
      <div className={(isLarge ? "py-1.5 mx-4" : "py-0.5 mx-2") + " bg-black/10 rounded-lg mb-1 text-center border border-black/5"}>
        <p className={(isLarge ? "text-[10px]" : "text-[6px]") + " font-black uppercase tracking-widest"}>{theme.label}</p>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 border-b border-black/5 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isLarge ? "text-lg" : "text-[10px]"}>{getElementIcon(poke.types)}</span>
            <span className={(isLarge ? "text-xs" : "text-[8px]") + " uppercase tracking-tighter font-black"}>{poke.moveName}</span>
          </div>
          <span className={(isLarge ? "text-base font-black" : "text-[10px] font-black")}>{poke.attack}</span>
        </div>
        {isLarge && <p className="text-[10px] mt-1.5 opacity-70 italic font-medium leading-tight">{poke.moveDesc}</p>}
      </div>
      <div className={"grid grid-cols-2 gap-1 " + (isLarge ? "py-3 px-6" : "py-1") + " text-center font-black"}>
        <div className="flex flex-col"><span className={isLarge ? "text-[10px] opacity-50" : "text-[5px] opacity-50"}>DEFENSE</span><span className={isLarge ? "text-sm" : "text-[8px]"}>{poke.defense}</span></div>
        <div className="flex flex-col"><span className={isLarge ? "text-[10px] opacity-50" : "text-[5px] opacity-50"}>SPEED</span><span className={isLarge ? "text-sm" : "text-[8px]"}>{poke.speed}</span></div>
      </div>
    </div>
  );
};

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [coins, setCoins] = useState(300);
  const [inventory, setInventory] = useState([]);
  const [view, setView] = useState('landing'); 
  const [selectedPoke, setSelectedPoke] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);
  const [playerPoke, setPlayerPoke] = useState(null);
  const [enemyPoke, setEnemyPoke] = useState(null);
  const [isFighting, setIsFighting] = useState(false);
  const [battleResult, setBattleResult] = useState(null); 
  const [battleLog, setBattleLog] = useState([]);
  const [hp, setHp] = useState({ p: 0, pMax: 0, e: 0, eMax: 0 });
  const [effect, setEffect] = useState({ p: null, e: null });
  const [animState, setAnimState] = useState({ p: 'idle', e: 'idle' });
  const [showGachaVideo, setShowGachaVideo] = useState(false);
  const timer = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('poke_v21_name');
    const savedCoins = localStorage.getItem('poke_v21_coins');
    const savedInv = localStorage.getItem('poke_v21_inv');
    if (savedName) {
      setPlayerName(savedName);
      setView('home');
    }
    if (savedInv && JSON.parse(savedInv).length > 0) {
      setInventory(JSON.parse(savedInv));
      if (savedCoins) setCoins(parseInt(savedCoins));
    } else { giveStarter(); }
  }, []);

  useEffect(() => {
    if (playerName) localStorage.setItem('poke_v21_name', playerName);
    localStorage.setItem('poke_v21_coins', coins.toString());
    localStorage.setItem('poke_v21_inv', JSON.stringify(inventory));
  }, [coins, inventory, playerName]);

  const giveStarter = async () => {
    try {
      const res = await fetch(POKE_API_BASE + "/1");
      const data = await res.json();
      setInventory([formatPokemon(data, 'COMMON')]);
    } catch (e) { setError("Gagal memuat starter."); }
  };

  const formatPokemon = (data, rarityOverride = null) => {
    if (!data) return null;
    const exp = data.base_experience || 100;
    const rarity = rarityOverride || (exp > 240 ? 'LEGENDARY' : exp > 160 ? 'RARE' : 'COMMON');
    const moveIndex = data.id % MOVE_NAMES.length;
    const descIndex = data.id % MOVE_DESCS.length;
    return {
      id: data.id, name: data.name,
      sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      hp: (data.stats[0]?.base_stat || 60) * 5,
      attack: data.stats[1]?.base_stat || 45,
      defense: data.stats[2]?.base_stat || 40,
      speed: data.stats[5]?.base_stat || 40,
      types: data.types.map(t => t.type.name),
      rarity, moveName: MOVE_NAMES[moveIndex], moveDesc: MOVE_DESCS[descIndex],
      uid: Date.now() + Math.random()
    };
  };

  const rollGacha = async () => {
    if (coins < 100) { setError("⚠️ Koin tidak cukup! Dapatkan koin dengan memenangkan duel di arena"); setTimeout(() => setError(null), 4000); return; }
    setRolling(true); setLastResult(null); setShowGachaVideo(true);
    try {
      const id = Math.floor(Math.random() * 800) + 1;
      const res = await fetch(POKE_API_BASE + "/" + id);
      const data = await res.json();
      const p = formatPokemon(data);
      if (p) { setCoins(c => c - 100); setInventory(prev => [p, ...prev]); setLastResult(p); }
    } catch (e) { setError("Professor sibuk."); }
    finally { setRolling(false); }
  };

  const runTurn = (isPlayerAttacking) => {
    if (battleResult) return;
    timer.current = setTimeout(() => {
      const attId = isPlayerAttacking ? 'p' : 'e';
      const defId = isPlayerAttacking ? 'e' : 'p';
      setAnimState(prev => { 
        const nextAnim = {...prev}; 
        nextAnim[attId] = 'attacking'; 
        return nextAnim; 
      });
      setTimeout(() => {
        setHp(prev => {
          let next = { ...prev };
          const attackerStat = isPlayerAttacking ? playerPoke : enemyPoke;
          const defenderStat = isPlayerAttacking ? enemyPoke : playerPoke;
          const isMiss = Math.random() < (defenderStat.speed / 600);
          let logMsg = "";
          if (isMiss) {
            setAnimState(pAn => { const n = {...pAn}; n[defId] = 'dodging'; return n; });
            setEffect(f => { const nf = {...f}; nf[defId] = 'MISS!'; return nf; });
            logMsg = "💨 " + defenderStat.name.toUpperCase() + " menghindar!";
          } else {
            setAnimState(pAn => { const n = {...pAn}; n[defId] = 'hit'; return n; });
            let d = Math.floor(attackerStat.attack * (0.8 + Math.random() * 0.4));
            next[defId] = Math.max(0, prev[defId] - d);
            setEffect(f => { const nf = {...f}; nf[defId] = "-" + d; return nf; });
            logMsg = "⚔️ " + attackerStat.name.toUpperCase() + " memberi " + d + " DMG!";
          }
          setBattleLog(prevLog => [logMsg, ...prevLog]);
          setTimeout(() => { setAnimState({ p: 'idle', e: 'idle' }); setEffect({ p: null, e: null }); }, 400);
          if (next.e <= 0) { setBattleResult('win'); setCoins(c => c + 250); setIsFighting(false); }
          else if (next.p <= 0) { setBattleResult('lose'); setIsFighting(false); }
          else { runTurn(!isPlayerAttacking); }
          return next;
        });
      }, 300);
    }, 1100);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      <nav className="bg-slate-900 border-b border-white/5 px-6 py-3 flex items-center justify-between shadow-xl z-50">
        <div className="flex items-center gap-3">
          <h1 className="font-black text-sm italic uppercase tracking-tighter">Poke<span className="text-red-600">Pro</span> V21</h1>
          {playerName && <span className="text-xs font-bold text-slate-400 border-l border-slate-600 pl-3">👤 {playerName}</span>}
        </div>
        <div className="bg-black/50 px-3 py-1 rounded-full border border-white/10 font-black text-[10px] flex items-center gap-1.5 shadow-inner">
          <CircleDollarSign className="w-3 h-3 text-yellow-500" /> {coins}
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {error && <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] bg-red-600 text-white px-6 py-2 rounded-xl shadow-2xl animate-bounce flex items-center gap-2"><AlertCircle size={14} /><span className="text-[10px] font-black uppercase tracking-widest">{error}</span></div>}
        {showGachaVideo && (
          <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in">
            <video 
              ref={videoRef}
              src={gachaVideo}
              autoPlay 
              onEnded={() => setShowGachaVideo(false)}
              className="w-full max-w-[90vw] h-auto max-h-[90vh] object-contain rounded-3xl shadow-2xl"
            />
            <p className="text-xs text-slate-400 mt-6 font-bold uppercase tracking-widest animate-pulse">Membuka Kartu...</p>
          </div>
        )}
        {view === 'landing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <h1 className="text-5xl font-black italic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-600 drop-shadow-2xl">POKEPRO V21</h1>
            <p className="text-sm text-slate-400 mb-12 font-semibold">Pokémon Trading Card Game</p>
            <div className="bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl mb-8">
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">🎮 Game Designed by <span className="font-bold text-white">Ruhul</span></p>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">💡 AI Assistance: <span className="font-semibold">Gemini AI, Claude AI</span></p>
              <p className="text-xs text-slate-500 mb-8 italic">Pokémon © 2024 Nintendo / The Pokémon Company. All Rights Reserved.</p>
              <div className="border-t border-white/5 pt-8">
                <label className="block text-sm font-bold text-slate-300 mb-3">Enter Your Name</label>
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && nameInput.trim() && (setPlayerName(nameInput.trim()), setView('home'))}
                  placeholder="Your Champion Name" 
                  maxLength="20"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-slate-600 font-semibold text-center focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all mb-6"
                />
                <button 
                  onClick={() => nameInput.trim() && (setPlayerName(nameInput.trim()), setView('home'))}
                  disabled={!nameInput.trim()}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${nameInput.trim() ? 'bg-gradient-to-r from-red-600 to-pink-600 border-b-4 border-red-800 text-white hover:shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'}`}
                >
                  ▶ Play Now
                </button>
              </div>
            </div>
          </div>
        )}
        {view === 'home' && (
          <div className="flex-1 flex flex-col p-4 animate-in fade-in duration-500">
            <div className="flex-1 flex items-center justify-center">
              {rolling ? <div className="w-16 h-16 bg-red-600 rounded-full animate-bounce border-4 border-white shadow-2xl"></div> : lastResult ? <TCGCard poke={lastResult} size="large" /> : <div className="opacity-10 text-center flex flex-col items-center gap-6"><Dices size={80} /><p className="font-black uppercase tracking-[0.4em] text-xs">BUKA PAKET KARTU</p></div>}
            </div>
            <div className="mt-auto space-y-2 pb-24">
              <button onClick={rollGacha} className="w-full py-4 bg-red-600 border-b-4 border-red-800 rounded-2xl font-black text-sm uppercase tracking-widest active:translate-y-1 active:border-b-0 transition-all">Gacha Kartu (100)</button>
              <button onClick={() => inventory.length > 0 ? setView('select') : setError("Tas Koleksi Kosong!")} className="w-full py-4 bg-indigo-600 border-b-4 border-indigo-800 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:translate-y-1 active:border-b-0 transition-all"><Swords size={18} /> Masuk Arena</button>
            </div>
          </div>
        )}
        {view === 'collection' && (
          <div className="flex-1 flex flex-col p-4 pb-32 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-[10px] font-black italic mb-6 uppercase tracking-widest text-slate-500">Tas Koleksi ({inventory.length})</h2>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
              {inventory.map(p => <button key={p.uid} onClick={() => { setSelectedPoke(p); setView('details'); }} className="transition-transform active:scale-95"><TCGCard poke={p} size="small" /></button>)}
            </div>
          </div>
        )}
        {view === 'details' && selectedPoke && (
          <div className="fixed inset-0 z-[250] bg-slate-950/98 flex flex-col p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mt-12 mb-8"><div className="w-10"></div><p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Inspeksi Kartu</p><button onClick={() => setView('collection')} className="p-2.5 bg-red-600 text-white rounded-full shadow-lg active:scale-90 transition-transform"><X size={20} strokeWidth={3} /></button></div>
            <div className="flex-1 flex flex-col items-center justify-start pt-2 overflow-hidden"><TCGCard poke={selectedPoke} size="large" /></div>
          </div>
        )}
        {view === 'select' && (
          <div className="flex-1 flex flex-col p-4 pb-32 animate-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6"><button onClick={() => setView('home')} className="p-2 bg-white/10 rounded-xl"><ChevronLeft size={20}/></button><h2 className="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Pilih Champion</h2></div>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
              {inventory.map(p => <button key={p.uid} onClick={() => {
                setPlayerPoke(p); setView('loading');
                fetch(POKE_API_BASE + "/" + (Math.floor(Math.random()*800)+1)).then(r => r.json()).then(d => {
                  const enemy = formatPokemon(d); setEnemyPoke(enemy); setHp({ p: p.hp, pMax: p.hp, e: enemy.hp, eMax: enemy.hp }); setView('battle'); setBattleResult(null); setBattleLog([]);
                }).catch(() => { setView('home'); setError("Arena sibuk."); });
              }} className="transition-transform active:scale-95"><TCGCard poke={p} size="small" /></button>)}
            </div>
          </div>
        )}
        {view === 'battle' && playerPoke && enemyPoke && (
          <div className="flex-1 flex flex-col p-4 pb-24 animate-in zoom-in-95">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 p-3 rounded-2xl border-l-4 border-indigo-500"><p className="text-[8px] font-black uppercase mb-1">{playerPoke.name}</p><div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: (hp.p/hp.pMax)*100 + "%" }} /></div></div>
              <div className="bg-black/40 p-3 rounded-2xl border-r-4 border-red-500 text-right"><p className="text-[8px] font-black uppercase mb-1">{enemyPoke.name}</p><div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-red-600 transition-all duration-300" style={{ width: (hp.e/hp.eMax)*100 + "%" }} /></div></div>
            </div>
            <div className="flex-1 bg-slate-900/40 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-around py-12 px-8 shadow-inner">
              <div className={"flex justify-end relative " + (animState.e === 'attacking' ? 'dash-e' : animState.e === 'dodging' ? 'dodge-e' : animState.e === 'hit' ? 'hit-e' : 'float')}>{effect.e && <div className="absolute -top-10 right-0 font-black text-2xl text-red-500 z-[100] drop-shadow-lg">{effect.e}</div>}<img src={enemyPoke.sprite} className="w-28 h-28 object-contain drop-shadow-2xl" alt="enemy" /></div>
              <div className={"flex justify-start relative " + (animState.p === 'attacking' ? 'dash-p' : animState.p === 'dodging' ? 'dodge-p' : animState.p === 'hit' ? 'hit-p' : 'float')}>{effect.p && <div className="absolute -top-10 left-0 font-black text-2xl text-indigo-400 z-[100] drop-shadow-lg">{effect.p}</div>}<img src={playerPoke.sprite} className="w-36 h-36 object-contain drop-shadow-2xl" alt="player" /></div>
              {battleResult && (
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center z-[200] animate-in fade-in">
                  <Trophy className={"w-16 h-16 mb-4 " + (battleResult === 'win' ? 'text-yellow-400 animate-bounce' : 'text-slate-600')} />
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">{battleResult === 'win' ? 'Victory!' : 'Defeat'}</h2>
                  {battleResult === 'win' && <div className="mt-4 bg-yellow-500 text-black px-8 py-2 rounded-2xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.5)] scale-110"><CircleDollarSign size={20} /><span className="text-xl">+250 KOIN</span></div>}
                  <button onClick={() => setView('select')} className="mt-12 w-full py-4 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-transform shadow-xl">Kembali</button>
                </div>
              )}
            </div>
            <div className="mt-4 bg-black/30 border border-white/5 rounded-2xl p-3 h-24 overflow-y-auto flex flex-col gap-1.5 shadow-inner">
              <div className="flex items-center gap-2 border-b border-white/5 pb-1 mb-1 opacity-50"><History size={12} /><span className="text-[9px] font-black uppercase tracking-widest">Battle Log</span></div>
              {battleLog.length === 0 ? <p className="text-[10px] text-slate-700 italic text-center py-2 uppercase tracking-widest">Menunggu Duel...</p> : battleLog.map((log, i) => <p key={i} className={"text-[10px] font-bold leading-tight " + (i === 0 ? "text-indigo-300" : "text-slate-500 opacity-60")}>{log}</p>)}
            </div>
            {!isFighting && !battleResult && <button onClick={() => { setIsFighting(true); runTurn(true); }} className="mt-4 py-4 bg-white text-black rounded-3xl font-black uppercase flex items-center justify-center gap-3 active:scale-95 shadow-xl transition-all"><Play size={20} fill="black" /> Duel Sekarang!</button>}
          </div>
        )}
        {view === 'loading' && <div className="flex-1 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-indigo-500 mb-4" size={40} /><p className="font-black uppercase text-[10px] tracking-widest animate-pulse">Arena...</p></div>}
      </main>
      {view !== 'battle' && view !== 'loading' && view !== 'landing' && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-1.5 flex gap-1 z-[300] shadow-2xl border-t-2 border-white/5">
          <button onClick={() => setView('home')} className={"flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all " + (view === 'home' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500')}><Dices size={18}/><span className="text-[7px] font-black uppercase">Gacha</span></button>
          <button onClick={() => setView('collection')} className={"flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all " + (view === 'collection' || view === 'details' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500')}><LayoutGrid size={18}/><span className="text-[7px] font-black uppercase">Koleksi</span></button>
          <button onClick={() => inventory.length > 0 ? setView('select') : setError("Tas Kosong!")} className={"flex-1 py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all " + (view === 'select' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500')}><Swords size={18}/><span className="text-[7px] font-black uppercase">Battle</span></button>
        </nav>
      )}
    </div>
  );
}