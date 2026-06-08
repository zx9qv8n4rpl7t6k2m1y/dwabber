/* ============================================================
   CIRCLE GAME — FULL VERSION
   Save | Shop | Skins | Trails | Backgrounds | Events | Powerups
============================================================ */

/* ── Save ─────────────────────────────────────────────────── */
var SAVE_KEY = 'cg_v4';
var save = {
    coins:0, best:0, runs:0,
    unlocked:['classic','neon','none','space'],
    skin:'classic', trail:'none', bg:'space',
    achievements:[], claimedAchs:[]
};
function loadSave(){
    try{var d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(d)for(var k in d)save[k]=d[k];}catch(e){}
}
function writeSave(){
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(e){}
}
loadSave();

/* ── Skins ──────────────────────────────────────────────────
   r0=startRadius  eat=eatBonus  over=eatOversize
   mag=magnetRange sh=shieldHits cm=coinMultiplier          */
var SKINS=[
  {id:'classic', name:'Classic', cost:0,   perk:'Balanced',              desc:'Standard start. Grow by eating smaller circles.',
   c1:'#FFFFFF',c2:'#88CCFF',c3:'#0066BB',glow:'#00BFFF', r0:10,eat:1,over:0,mag:0,  sh:0,cm:1  },
  {id:'neon',    name:'Neon',    cost:0,   perk:'Head Start',             desc:'Starts 30% bigger than Classic. Great for beginners.',
   c1:'#AAFFEE',c2:'#00FFCC',c3:'#007755',glow:'#00FFAA', r0:13,eat:1,over:0,mag:0,  sh:0,cm:1  },
  {id:'lucky',   name:'Lucky',   cost:60,  perk:'Coin Magnet',            desc:'Earns +50% coins every run. Best for grinding the shop.',
   c1:'#FFE066',c2:'#FFAA00',c3:'#AA5500',glow:'#FFD700', r0:10,eat:1,over:0,mag:0,  sh:0,cm:1.5},
  {id:'shield',  name:'Shield',  cost:80,  perk:'Extra Hit',              desc:'Blue ring absorbs one fatal hit, then disappears. One chance.',
   c1:'#FFFFFF',c2:'#99DDFF',c3:'#2255AA',glow:'#00AAFF', r0:10,eat:1,over:0,mag:0,  sh:1,cm:1  },
  {id:'magnet',  name:'Magnet',  cost:120, perk:'Pulls Small Circles',    desc:'Nearby smaller circles drift toward you automatically.',
   c1:'#FFFFFF',c2:'#FFE033',c3:'#AA7700',glow:'#FFD700', r0:10,eat:1,over:0,mag:150,sh:0,cm:1  },
  {id:'ghost',   name:'Ghost',   cost:150, perk:'Big Appetite',           desc:'Can eat circles up to 8px larger. Dangerous but rewarding.',
   c1:'#DDAAFF',c2:'#9933FF',c3:'#440088',glow:'#BB66FF', r0:10,eat:1,over:8,mag:0,  sh:0,cm:1  },
  {id:'tiny',    name:'Tiny',    cost:100, perk:'High Risk / Reward',     desc:'Starts very small but gains +3 size per eat instead of +1.',
   c1:'#CCAAFF',c2:'#7733FF',c3:'#330099',glow:'#9955FF', r0:5, eat:3,over:0,mag:0,  sh:0,cm:1  },
  {id:'blaze',   name:'Blaze',   cost:200, perk:'Born Bigger + Coins',    desc:'Starts large at radius 18 and earns +50% coins per run.',
   c1:'#FFAA66',c2:'#FF4400',c3:'#880000',glow:'#FF6600', r0:18,eat:1,over:0,mag:0,  sh:0,cm:1.5},
  {id:'phantom', name:'Phantom', cost:280, perk:'Two Lives',              desc:'Has TWO shield rings. Survive two fatal hits before dying.',
   c1:'#CCCCDD',c2:'#8888AA',c3:'#333355',glow:'#9999CC', r0:10,eat:1,over:0,mag:0,  sh:2,cm:1  },
  {id:'frost',   name:'Frost',   cost:160, perk:'Arctic Pull',            desc:'Weaker magnet pull on nearby small circles. Icy aesthetic.',
   c1:'#EEFEFF',c2:'#88DDFF',c3:'#0088AA',glow:'#44CCFF', r0:10,eat:1,over:0,mag:80, sh:0,cm:1  },
  {id:'shadow',  name:'Shadow',  cost:220, perk:'Sneaky Eater + Coins',   desc:'Eat circles up to 5px larger and earn +20% bonus coins.',
   c1:'#BBBBCC',c2:'#554488',c3:'#110022',glow:'#8844BB', r0:10,eat:1,over:5,mag:0,  sh:0,cm:1.2},
  {id:'rebel',   name:'Rebel',   cost:180, perk:'Quick Grower',           desc:'Starts small but grows +2 per eat. Great middle-ground skin.',
   c1:'#FF8899',c2:'#FF2255',c3:'#880033',glow:'#FF3366', r0:7, eat:2,over:0,mag:0,  sh:0,cm:1  },
  {id:'gold',    name:'Gold',    cost:350, perk:'Double Coins',           desc:'Earns 2x coins every single run. Ultimate money skin.',
   c1:'#FFFF99',c2:'#FFCC00',c3:'#886600',glow:'#FFDD00', r0:9, eat:1,over:0,mag:0,  sh:0,cm:2  },
  {id:'plasma',  name:'Plasma',  cost:260, perk:'Super Appetite',         desc:'Eat circles up to 12px larger than you. Very aggressive.',
   c1:'#FFAAFF',c2:'#FF44DD',c3:'#880055',glow:'#FF66EE', r0:9, eat:1,over:12,mag:0, sh:0,cm:1  },
  {id:'crystal', name:'Crystal', cost:300, perk:'Two Lives + Coins',      desc:'Two shield rings AND earns +20% extra coins per run.',
   c1:'#DDEEFF',c2:'#88BBFF',c3:'#224488',glow:'#AACCFF', r0:10,eat:1,over:0,mag:0,  sh:2,cm:1.2},
  {id:'venom',   name:'Venom',   cost:240, perk:'Toxic Grower',           desc:'Starts small but earns +2 per eat AND +30% more coins.',
   c1:'#AAFFAA',c2:'#22CC22',c3:'#004400',glow:'#44FF44', r0:6, eat:2,over:0,mag:0,  sh:0,cm:1.3},
  {id:'solar',   name:'Solar',   cost:320, perk:'Magnet + Appetite',      desc:'Pulls small circles AND can eat circles 5px larger.',
   c1:'#FFEEAA',c2:'#FFAA00',c3:'#AA5500',glow:'#FFCC33', r0:10,eat:1,over:5,mag:100,sh:0,cm:1  }
];

/* ── Trails ─────────────────────────────────────────────────── */
var TRAILS=[
  {id:'none',     name:'None',     cost:0,   color:null       },
  {id:'sparkle',  name:'Sparkle',  cost:40,  color:'#FFFFFF'  },
  {id:'fire',     name:'Fire',     cost:70,  color:'#FF6600'  },
  {id:'rainbow',  name:'Rainbow',  cost:100, color:'rainbow'  },
  {id:'comet',    name:'Comet',    cost:60,  color:'#BB66FF'  },
  {id:'electric', name:'Electric', cost:80,  color:'#FFFF44'  },
  {id:'void',     name:'Void',     cost:90,  color:'#5500AA'  },
  {id:'lava',     name:'Lava',     cost:110, color:'#FF3300'  },
  {id:'ice',      name:'Ice',      cost:75,  color:'#88DDFF'  },
  {id:'gilded',   name:'Gilded',   cost:130, color:'#FFD700'  },
  {id:'swarm',    name:'Swarm',    cost:0,   color:'#9999CC', ach:true }  /* achievement-only */
];

/* ── Backgrounds ─────────────────────────────────────────────── */
var BACKGROUNDS=[
  {id:'space',  name:'Space',  cost:0 },
  {id:'aurora', name:'Aurora', cost:80},
  {id:'deep',   name:'Deep',   cost:50}
];

/* ── Powerup types ───────────────────────────────────────────── */
var PWR=[
  {id:'shield',label:'SH',name:'SHIELD',   color:'#44AAFF',glow:'#0066FF',dur:8000 },
  {id:'freeze',label:'FR',name:'FREEZE',   color:'#AADDFF',glow:'#66BBFF',dur:6000 },
  {id:'coins', label:'2X',name:'2X COINS', color:'#FFD700',glow:'#FF8C00',dur:15000},
  {id:'magnet',label:'MG',name:'MAGNET',   color:'#FF44FF',glow:'#CC00CC',dur:10000}
];

/* ── Events ──────────────────────────────────────────────────── */
var EVTS=[
  {id:'golden',name:'GOLDEN RUSH!',  color:'#FFD700',dur:18000},
  {id:'double',name:'DOUBLE SCORE!', color:'#44FF88',dur:20000},
  {id:'tiny',  name:'TINY MODE!',    color:'#AADDFF',dur:18000},
  {id:'frenzy',name:'SPEED FRENZY!', color:'#FF4444',dur:14000}
];

/* ── Achievements  (coins = reward on claim, unlock = id to auto-unlock) ── */
var ACHS=[
  {id:'first',     name:'First Blood',   coins:5,   desc:'Complete your first run.'},
  {id:'devourer',  name:'Devourer',      coins:10,  desc:'Eat 10 circles in a single run.'},
  {id:'bigScore',  name:'High Roller',   coins:20,  desc:'Score 30+ in a single run.'},
  {id:'rich',      name:'Coin Hoarder',  coins:15,  desc:'Accumulate 100 total coins.'},
  {id:'veteran',   name:'Veteran',       coins:15,  desc:'Play 10 runs.'},
  {id:'score50',   name:'Survivor',      coins:30,  desc:'Score 50+ in a single run.'},
  {id:'score100',  name:'Centurion',     coins:50,  desc:'Score 100+ in a single run.'},
  {id:'score200',  name:'Legend',        coins:100, desc:'Score 200+ in a single run.'},
  {id:'score500',  name:'Unstoppable',   coins:200, desc:'Score 500+ in a single run.'},
  {id:'score1000', name:'Mythical',      coins:300, desc:'Score 1000+ in a single run.'},
  {id:'goat5k',    name:'GOAT',          coins:500, desc:'Score 5000+. Unlocks the Swarm trail!', unlock:'swarm'},
  {id:'golden5',   name:'Golden Touch',  coins:25,  desc:'Eat 5 golden circles in one run.'},
  {id:'powerup3',  name:'Power Hungry',  coins:20,  desc:'Collect 3 powerups in one run.'},
  {id:'runs25',    name:'Dedicated',     coins:30,  desc:'Play 25 runs.'},
  {id:'runs100',   name:'Obsessed',      coins:75,  desc:'Play 100 runs.'},
  {id:'eat50',     name:'Hungry Hungry', coins:40,  desc:'Eat 50 circles in one run.'},
  {id:'noHit',     name:'Untouched',     coins:35,  desc:'Score 20+ without your shield absorbing a hit.'},
  {id:'shop3',     name:'Shopper',       coins:25,  desc:'Unlock 3 items from the shop.'},
  {id:'eventRider',name:'Event Rider',   coins:20,  desc:'Be alive when a random event triggers.'}
];

/* ── Helpers ─────────────────────────────────────────────────── */
function getSkin(id){for(var i=0;i<SKINS.length;i++)if(SKINS[i].id===id)return SKINS[i];return SKINS[0];}
function getTrail(id){for(var i=0;i<TRAILS.length;i++)if(TRAILS[i].id===id)return TRAILS[i];return TRAILS[0];}
function getBg(id){for(var i=0;i<BACKGROUNDS.length;i++)if(BACKGROUNDS[i].id===id)return BACKGROUNDS[i];return BACKGROUNDS[0];}
function isOwned(id){return save.unlocked.indexOf(id)>=0;}

/* ============================================================
   MAIN GAME OBJECT
============================================================ */
var cg={
  /* ── State ──────────────────────────────────────────────── */
  screen:'menu', shopTab:0, shopInfoSkin:null,
  menuSkinIdx:0, menuTrailIdx:0, menuBgIdx:0,
  clickRegions:[], hovR:null, mouseX:0, mouseY:0,

  /* ── Runtime ────────────────────────────────────────────── */
  lastTime:(new Date()).getTime(),
  circles:[], powerups:[], particles:[], pTrail:[], swarmMinions:[],
  notifications:[], player:null, skin:null, trail:null, bg:null,

  /* ── Run ────────────────────────────────────────────────── */
  runCoins:0, eatCount:0, milestonesHit:{}, milestone:null,
  newAchs:[], deathPts:0, deathCoins:0, isNewBest:false,
  shakeTime:0, shakeAmt:0,
  goldenEaten:0, powerupsCollected:0, shieldAbsorbs:0, eventTriggered:false,

  /* ── Effects  { id: endTimestamp } ──────────────────────── */
  fx:{}, nextEvt:0, nextPwr:0,
  goldenLeft:0, activeEvtId:'', activeEvtName:'',

  /* ── Config ─────────────────────────────────────────────── */
  config:{
    width:640, height:960, autosize:true,
    circle:{
      count:1.75, minRadius:5, maxRadius:55,
      radiusInterval:10, speedScale:3,
      colors:['#00BFFF','#1E90FF','#7B68EE','#7FFFD4','#00FF7F',
              '#6A0DAD','#FF3333','#CC0000','#FF00FF','#FF1493',
              '#FF8C00','#FF4500','#ADFF2F','#9400D3']
    },
    touchmove:(typeof isEventSupported!=='undefined')&&isEventSupported('touchmove')
  },

  /* ── Effect helpers ─────────────────────────────────────── */
  on:function(id){return!!cg.fx[id]&&Date.now()<cg.fx[id];},
  activate:function(id,dur){cg.fx[id]=Date.now()+dur;},

  /* ── Owned lists ────────────────────────────────────────── */
  oSkins: function(){return SKINS.filter(function(s){return isOwned(s.id);});},
  oTrails:function(){return TRAILS.filter(function(t){return isOwned(t.id);});},
  oBgs:   function(){return BACKGROUNDS.filter(function(b){return isOwned(b.id);});},

  /* ── Init ───────────────────────────────────────────────── */
  init:function(){
    cg.autosize();
    cg.skin=getSkin(save.skin); cg.trail=getTrail(save.trail); cg.bg=getBg(save.bg);
    var os=cg.oSkins(); for(var i=0;i<os.length;i++)if(os[i].id===save.skin){cg.menuSkinIdx=i;break;}
    var ot=cg.oTrails();for(var i=0;i<ot.length;i++)if(ot[i].id===save.trail){cg.menuTrailIdx=i;break;}
    var ob=cg.oBgs();  for(var i=0;i<ob.length;i++)if(ob[i].id===save.bg){cg.menuBgIdx=i;break;}

    this.canvas=$('canvas');
    this.canvas.attr({width:this.config.width,height:this.config.height});
    this.canvas=this.canvas[0];
    this.ctx=this.canvas.getContext('2d');

    for(var i=0;i<cg.maxCircles();i++) cg.circles.push(new Circle(true));

    $(this.canvas).click(function(e){cg.onClick(e.clientX,e.clientY);});
    $(document).mousemove(function(e){
      cg.mouseX=e.clientX; cg.mouseY=e.clientY;
      if((cg.screen==='playing'||cg.screen==='paused')&&cg.player){cg.player.x=e.clientX;cg.player.y=e.clientY;}
      cg.updateHov();
    });
    if(this.config.touchmove){
      $(document).bind('touchmove',function(e){
        e.preventDefault();
        var t=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0];
        cg.mouseX=t.clientX; cg.mouseY=t.clientY;
        if((cg.screen==='playing'||cg.screen==='paused')&&cg.player){cg.player.x=t.clientX;cg.player.y=t.clientY;}
      });
    }
    $(window).keydown(function(e){
      if(e.keyCode===32&&(cg.screen==='playing'||cg.screen==='paused')){cg.togglePause();e.preventDefault();}
      if(e.keyCode===27&&(cg.screen==='playing'||cg.screen==='paused')){cg.pause();e.preventDefault();}
    });
    $(window).blur(function(){if(cg.screen==='playing')cg.pause();});
    cg.tick();
  },

  autosize:function(){
    if(!cg.config.autosize)return;
    cg.config.width=window.innerWidth; cg.config.height=window.innerHeight;
    if(cg.canvas)$(cg.canvas).attr({width:cg.config.width,height:cg.config.height});
  },
  maxCircles:function(){return Math.round(cg.config.width*cg.config.height/10000/cg.config.circle.count);},

  /* ── Lifecycle ──────────────────────────────────────────── */
  start:function(){
    cg.screen='playing';
    cg.skin=getSkin(save.skin); cg.trail=getTrail(save.trail); cg.bg=getBg(save.bg);
    cg.player=new Player();
    cg.circles=[]; cg.powerups=[]; cg.particles=[]; cg.pTrail=[];
    cg.runCoins=0; cg.eatCount=0; cg.milestonesHit={}; cg.milestone=null;
    cg.fx={}; cg.goldenLeft=0; cg.activeEvtId=''; cg.activeEvtName='';
    cg.goldenEaten=0; cg.powerupsCollected=0; cg.shieldAbsorbs=0; cg.eventTriggered=false;
    cg.swarmMinions=[];
    cg.nextEvt=Date.now()+30000+Math.random()*30000;
    cg.nextPwr=Date.now()+25000+Math.random()*25000;
    /* No pre-spawn — circles enter from edges so player is never surrounded at start */
    $(cg.canvas).css('cursor','none');
    save.runs=(save.runs||0)+1;
  },

  death:function(){
    var sc=Math.max(0,cg.player.radius-cg.skin.r0);
    cg.deathPts=sc;
    cg.deathCoins=Math.floor(sc*cg.skin.cm*(cg.on('coins')?2:1)/2);
    save.coins+=cg.deathCoins;
    cg.isNewBest=sc>save.best;
    if(cg.isNewBest)save.best=sc;
    cg.spawnP(cg.player.x,cg.player.y,'#FFFFFF',20);
    cg.spawnP(cg.player.x,cg.player.y,cg.skin.glow,15);
    cg.screen='dead'; cg.shakeTime=20; cg.shakeAmt=14;
    cg.checkAchs(); writeSave();
    $(cg.canvas).css('cursor','default');
    cg.player=null;
  },

  pause:function(){if(cg.screen==='playing'){cg.screen='paused';}},
  unpause:function(){if(cg.screen==='paused'){cg.screen='playing';$(cg.canvas).css('cursor','none');}},
  togglePause:function(){cg.screen==='paused'?cg.unpause():cg.pause();},

  /* ── Main loop ──────────────────────────────────────────── */
  tick:function(){
    var now=(new Date()).getTime();
    window.elapsed=Math.min(now-cg.lastTime,50);
    cg.lastTime=now;
    requestAnimFrame(cg.tick);
    cg.autosize();

    cg.drawBg();

    var playing=cg.screen==='playing', paused=cg.screen==='paused';

    /* Circles */
    if(playing){
      /* spawn from edges more eagerly so the arena fills quickly */
      if(cg.circles.length<cg.maxCircles()&&Math.random()<0.35) cg.circles.push(new Circle(false));
      if(cg.on('golden')&&cg.goldenLeft>0&&Math.random()<0.025){
        var gc=new Circle(false);gc.golden=true;gc.color='#FFD700';cg.circles.push(gc);cg.goldenLeft--;
      }
    } else if(!paused&&cg.circles.length<cg.maxCircles()*0.8&&Math.random()<0.04){
      cg.circles.push(new Circle(true));
    }
    for(var i=0;i<cg.circles.length;i++){
      if(!cg.circles[i])continue;
      if(playing?cg.circles[i].tick():cg.circles[i].render())i--;
    }

    /* Powerups */
    for(var j=cg.powerups.length-1;j>=0;j--){
      if((playing?cg.powerups[j].tick():cg.powerups[j].render()))cg.powerups.splice(j,1);
    }

    cg.tickP();

    if((playing||paused)&&cg.player)cg.updateTrail();
    cg.drawTrail();

    if(cg.player)playing?cg.player.tick():cg.player.render();

    if(playing){
      cg.applyMagnet(); cg.applyFrost(); cg.tickSwarm(); cg.checkEvt(); cg.checkPwr();
      cg.drawHUD(); cg.drawFX(); cg.drawMilestone();
    } else if(paused){
      cg.drawHUD();
    }

    cg.tickNots();

    if(cg.screen==='menu')        cg.drawMenu();
    if(cg.screen==='shop')        cg.drawShop();
    if(cg.screen==='achievements')cg.drawAchs();
    if(cg.screen==='dead')        cg.drawDead();
    if(cg.screen==='paused')      cg.drawPaused();
  },

  /* ── Backgrounds ────────────────────────────────────────── */
  drawBg:function(){
    var id=(cg.bg||getBg('space')).id;
    if(id==='aurora')cg.drawBgAurora();
    else if(id==='deep')cg.drawBgDeep();
    else cg.drawBgSpace();
  },
  drawBgSpace:function(){
    var x=cg.ctx,W=cg.config.width,H=cg.config.height;
    var g=x.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.85);
    g.addColorStop(0,'#0d0d1e');g.addColorStop(1,'#020208');
    x.fillStyle=g;x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,0.028)';x.lineWidth=1;x.beginPath();
    for(var px=0;px<W;px+=60){x.moveTo(px,0);x.lineTo(px,H);}
    for(var py=0;py<H;py+=60){x.moveTo(0,py);x.lineTo(W,py);}
    x.stroke();
  },
  drawBgAurora:function(){
    var x=cg.ctx,W=cg.config.width,H=cg.config.height,t=Date.now()/3000;
    x.fillStyle='#050a10';x.fillRect(0,0,W,H);
    var cs=[['rgba(0,200,100,0.07)','rgba(0,200,100,0)'],
            ['rgba(100,0,200,0.06)','rgba(100,0,200,0)'],
            ['rgba(0,100,200,0.07)','rgba(0,100,200,0)']];
    for(var i=0;i<3;i++){
      var gx=W*(0.2+i*0.3),gy=H*(0.35+Math.sin(t+i*1.2)*0.2);
      var gr=x.createRadialGradient(gx,gy,0,gx,gy,Math.max(W,H)*0.55);
      gr.addColorStop(0,cs[i][0]);gr.addColorStop(1,cs[i][1]);
      x.fillStyle=gr;x.fillRect(0,0,W,H);
    }
  },
  drawBgDeep:function(){
    var x=cg.ctx,W=cg.config.width,H=cg.config.height;
    var g=x.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#000814');g.addColorStop(1,'#001a33');
    x.fillStyle=g;x.fillRect(0,0,W,H);
    for(var py=0;py<H;py+=80){
      x.strokeStyle='rgba(0,80,180,0.04)';x.lineWidth=18;
      x.beginPath();x.moveTo(0,py);x.lineTo(W,py);x.stroke();
    }
  },

  /* ── Trail ──────────────────────────────────────────────── */
  updateTrail:function(){
    var t=cg.trail||getTrail('none');
    if(!t||t.id==='none'||!cg.player)return;
    cg.pTrail.push({x:cg.player.x,y:cg.player.y,ts:Date.now()});
    while(cg.pTrail.length>22)cg.pTrail.shift();
  },
  drawTrail:function(){
    var t=cg.trail||getTrail('none');
    if(!t||t.id==='none'||!cg.pTrail.length)return;
    var now=Date.now(),pr=cg.player?cg.player.radius:10;
    for(var i=0;i<cg.pTrail.length;i++){
      var p=cg.pTrail[i],age=(now-p.ts)/500;
      if(age>1)continue;
      var alpha=(1-age)*0.55,r2=pr*(1-age)*0.75;
      var color=t.color==='rainbow'?'hsl('+(i/cg.pTrail.length*360+now/8)%360+',100%,60%)':t.color;
      cg.ctx.save();cg.ctx.globalAlpha=alpha;
      cg.ctx.shadowColor=color;cg.ctx.shadowBlur=5;
      cg.ctx.beginPath();cg.ctx.arc(p.x,p.y,Math.max(1,r2),0,Math.PI*2);
      cg.ctx.fillStyle=color;cg.ctx.fill();cg.ctx.restore();
    }
  },

  /* ── HUD ────────────────────────────────────────────────── */
  drawHUD:function(){
    if(!cg.player&&cg.screen!=='paused')return;
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    var score=cg.player?Math.max(0,cg.player.radius-cg.skin.r0):0;
    var sk=cg.skin||getSkin('classic');
    ctx.save();ctx.textBaseline='top';ctx.textAlign='left';

    ctx.font='bold 22pt Verdana';ctx.shadowColor=sk.glow;ctx.shadowBlur=10;
    ctx.fillStyle='rgba(255,255,255,0.9)';ctx.fillText('Score: '+score,20,14);
    ctx.shadowBlur=0;

    if(save.best>0){
      ctx.font='13pt Verdana';ctx.fillStyle='rgba(255,215,0,0.7)';
      ctx.fillText('Best: '+save.best,20,48);
    }
    var earned=Math.floor(score*sk.cm*(cg.on('coins')?2:1)/2);
    cg.drawCoinIcon(20,71,9);
    ctx.font='12pt Verdana';ctx.fillStyle='rgba(255,215,0,0.65)';
    ctx.fillText(earned+' this run',36,69);

    if(cg.activeEvtName){
      var ev2=null;for(var i=0;i<EVTS.length;i++)if(EVTS[i].id===cg.activeEvtId){ev2=EVTS[i];break;}
      ctx.font='bold 11pt Verdana';ctx.textAlign='center';
      ctx.fillStyle=ev2?ev2.color:'#FFFFFF';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=8;
      ctx.fillText('⚡ '+cg.activeEvtName,W/2,14);ctx.shadowBlur=0;
    }
    if(sk.id==='shield'&&cg.player&&cg.player.shieldHits>0){
      ctx.font='bold 12pt Verdana';ctx.textAlign='right';
      ctx.fillStyle='#00AAFF';ctx.shadowColor='#00AAFF';ctx.shadowBlur=8;
      ctx.fillText('SHIELD ACTIVE',W-18,14);ctx.shadowBlur=0;
    }
    ctx.font='10pt Verdana';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,0.2)';
    ctx.fillText('SPACE = pause',20,H-22);
    ctx.restore();
  },

  /* ── Active FX timers ───────────────────────────────────── */
  drawFX:function(){
    var now=Date.now(),x=cg.config.width-18,y=48;
    var ctx=cg.ctx;
    ctx.save();ctx.textAlign='right';ctx.textBaseline='middle';ctx.font='bold 9pt Verdana';
    var ids=['shield','freeze','coins','magnet','double','golden','tiny','frenzy'];
    for(var i=0;i<ids.length;i++){
      var id=ids[i];if(!cg.on(id))continue;
      var rem=Math.ceil((cg.fx[id]-now)/1000);
      var color='#FFFFFF';
      for(var j=0;j<PWR.length;j++)if(PWR[j].id===id){color=PWR[j].color;break;}
      for(var j=0;j<EVTS.length;j++)if(EVTS[j].id===id){color=EVTS[j].color;break;}
      ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=5;
      ctx.fillText(id.substring(0,3).toUpperCase()+' '+rem+'s',x,y);
      ctx.shadowBlur=0;y+=20;
    }
    ctx.restore();
  },

  /* ── Menu ───────────────────────────────────────────────── */
  drawMenu:function(){
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    cg.clickRegions=[];
    ctx.fillStyle='rgba(0,0,0,0.52)';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.textBaseline='middle';

    /* coins */
    cg.drawCoinIcon(28,26,12);
    ctx.font='bold 16pt Verdana';ctx.fillStyle='#FFD700';ctx.textAlign='left';
    ctx.fillText(save.coins,48,26);

    /* best */
    if(save.best>0){
      ctx.font='12pt Verdana';ctx.fillStyle='rgba(255,255,255,0.42)';
      ctx.textAlign='center';ctx.fillText('Best: '+save.best+' pts',W/2,26);
    }

    /* SHOP btn */
    var sx=W-85,sy=10,sw=74,sh2=32;
    ctx.fillStyle=cg.hovR==='shop'?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.1)';
    cg.rr(sx,sy,sw,sh2,8);
    ctx.font='11pt Verdana';ctx.fillStyle='#FFFFFF';ctx.textAlign='center';
    ctx.fillText('SHOP',sx+sw/2,sy+sh2/2);cg.reg('shop',sx,sy,sw,sh2);

    /* ACHIEVEMENTS btn */
    var ax=W-85,ay=48,aw=74,ah=32;
    ctx.fillStyle=cg.hovR==='achmenu'?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.1)';
    cg.rr(ax,ay,aw,ah,8);
    ctx.font='10pt Verdana';ctx.fillStyle='#FFFFFF';ctx.textAlign='center';
    ctx.fillText('ACHIEV.',ax+aw/2,ay+ah/2);cg.reg('achmenu',ax,ay,aw,ah);

    /* red badge for unclaimed achievements */
    var unclaimed=0;
    if(!save.claimedAchs)save.claimedAchs=[];
    for(var ai=0;ai<save.achievements.length;ai++){
      if(save.claimedAchs.indexOf(save.achievements[ai])<0)unclaimed++;
    }
    if(unclaimed>0){
      ctx.save();
      ctx.beginPath();ctx.arc(ax+aw-2,ay-2,9,0,Math.PI*2);
      ctx.fillStyle='#FF2222';ctx.shadowColor='#FF0000';ctx.shadowBlur=8;ctx.fill();
      ctx.shadowBlur=0;ctx.font='bold 9pt Verdana';ctx.fillStyle='#FFFFFF';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(unclaimed,ax+aw-2,ay-2);
      ctx.restore();
    }

    /* title */
    var sk=getSkin(save.skin);
    ctx.font='bold 44pt Verdana';ctx.textAlign='center';
    ctx.shadowColor=sk.glow;ctx.shadowBlur=22;
    ctx.fillStyle='#FFFFFF';ctx.fillText('CIRCLE GAME',W/2,H*0.17);ctx.shadowBlur=0;

    /* skin selector */
    var os=cg.oSkins(),skinObj=os[cg.menuSkinIdx%os.length];
    var skinY=H*0.38,skinR=Math.min(52,W*0.12);
    cg.drawArrow(W/2-skinR-38,skinY,'l',cg.hovR==='skinL');
    cg.reg('skinL',W/2-skinR-65,skinY-22,52,44);
    cg.drawSkinPrev(skinObj,W/2,skinY,skinR,true);
    cg.drawArrow(W/2+skinR+38,skinY,'r',cg.hovR==='skinR');
    cg.reg('skinR',W/2+skinR+13,skinY-22,52,44);
    ctx.font='bold 18pt Verdana';ctx.textAlign='center';ctx.fillStyle='#FFFFFF';
    ctx.fillText(skinObj.name,W/2,skinY+skinR+28);
    ctx.font='12pt Verdana';ctx.fillStyle=skinObj.glow;
    ctx.fillText(skinObj.perk+' — '+skinObj.desc,W/2,skinY+skinR+50);

    /* trail row */
    var ot=cg.oTrails(),trailObj=ot[cg.menuTrailIdx%ot.length];
    var trailY=H*0.624;
    ctx.font='13pt Verdana';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.textAlign='center';
    ctx.fillText('Trail:',W/2,trailY-16);
    cg.drawArrow(W/2-60,trailY+4,'l',cg.hovR==='trailL');cg.reg('trailL',W/2-88,trailY-12,44,30);
    var tc=trailObj.id==='none'?'rgba(255,255,255,0.38)':(trailObj.color==='rainbow'?'#FF88FF':trailObj.color);
    ctx.font='bold 13pt Verdana';ctx.fillStyle=tc;ctx.fillText(trailObj.name,W/2,trailY+6);
    cg.drawArrow(W/2+60,trailY+4,'r',cg.hovR==='trailR');cg.reg('trailR',W/2+44,trailY-12,44,30);

    /* bg row */
    var ob=cg.oBgs(),bgObj=ob[cg.menuBgIdx%ob.length];
    var bgY=H*0.683;
    ctx.font='13pt Verdana';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.textAlign='center';
    ctx.fillText('Background:',W/2,bgY-16);
    cg.drawArrow(W/2-60,bgY+4,'l',cg.hovR==='bgL');cg.reg('bgL',W/2-88,bgY-12,44,30);
    ctx.font='bold 13pt Verdana';ctx.fillStyle='rgba(255,255,255,0.8)';ctx.fillText(bgObj.name,W/2,bgY+6);
    cg.drawArrow(W/2+60,bgY+4,'r',cg.hovR==='bgR');cg.reg('bgR',W/2+44,bgY-12,44,30);

    /* PLAY btn */
    var pW=Math.min(210,W*0.5),pH=52,pX=W/2-pW/2,pY=H*0.783-pH/2;
    ctx.save();ctx.shadowColor=skinObj.glow;ctx.shadowBlur=cg.hovR==='play'?28:14;
    var pg=ctx.createLinearGradient(pX,pY,pX+pW,pY+pH);
    pg.addColorStop(0,skinObj.glow);pg.addColorStop(1,skinObj.c3);
    ctx.fillStyle=pg;cg.rr(pX,pY,pW,pH,12);ctx.shadowBlur=0;
    ctx.font='bold 20pt Verdana';ctx.fillStyle='#FFFFFF';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('PLAY',W/2,pY+pH/2);ctx.restore();
    cg.reg('play',pX,pY,pW,pH);

    ctx.restore();
  },

  /* ── Shop ───────────────────────────────────────────────── */
  drawShop:function(){
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    cg.clickRegions=[];
    ctx.fillStyle='rgba(0,0,0,0.88)';ctx.fillRect(0,0,W,H);
    ctx.save();

    ctx.font='bold 13pt Verdana';ctx.fillStyle=cg.hovR==='back'?'#FFFFFF':'rgba(255,255,255,0.65)';
    ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('← BACK',18,28);cg.reg('back',10,14,100,28);

    cg.drawCoinIcon(W-74,26,11);
    ctx.font='bold 15pt Verdana';ctx.fillStyle='#FFD700';ctx.textAlign='left';ctx.fillText(save.coins,W-58,26);
    ctx.font='bold 26pt Verdana';ctx.fillStyle='#FFFFFF';ctx.textAlign='center';ctx.fillText('SHOP',W/2,28);

    var tabs=['SKINS','TRAILS','BACKGROUNDS'];
    var tW=Math.min(110,(W-30)/3),tH=30,tY=52,tStart=W/2-(tW*3)/2;
    for(var ti=0;ti<3;ti++){
      var tx=tStart+ti*tW;
      ctx.fillStyle=cg.shopTab===ti?'rgba(255,255,255,0.2)':(cg.hovR==='tab'+ti?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)');
      cg.rr(tx+1,tY,tW-2,tH,6);
      ctx.font=(cg.shopTab===ti?'bold ':'')+'10pt Verdana';
      ctx.fillStyle=cg.shopTab===ti?'#FFFFFF':'rgba(255,255,255,0.55)';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tabs[ti],tx+tW/2,tY+tH/2);
      cg.reg('tab'+ti,tx+1,tY,tW-2,tH);
    }

    var rawItems=cg.shopTab===0?SKINS:cg.shopTab===1?TRAILS:BACKGROUNDS;
    /* hide achievement-only items from shop */
    var items=rawItems.filter(function(it){return !it.ach;});
    var cols=Math.max(2,Math.min(4,Math.floor((W-20)/128)));
    var cW=Math.floor((W-20)/cols),cH=128,gY=92;

    for(var idx=0;idx<items.length;idx++){
      var item=items[idx];
      var col2=idx%cols,row=Math.floor(idx/cols);
      var cx=10+col2*cW,cy=gY+row*cH;
      var isOw=isOwned(item.id);
      var isEq=(cg.shopTab===0&&save.skin===item.id)||(cg.shopTab===1&&save.trail===item.id)||(cg.shopTab===2&&save.bg===item.id);
      var canBuy=save.coins>=item.cost,hov=cg.hovR==='item'+idx;

      ctx.fillStyle=isEq?'rgba(255,255,255,0.14)':hov?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.04)';
      cg.rr(cx+3,cy+3,cW-6,cH-6,10);
      if(isEq){ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1.5;cg.rrs(cx+3,cy+3,cW-6,cH-6,10);}

      ctx.save();if(!isOw)ctx.globalAlpha=0.32;
      var pY3=cy+44;
      if(cg.shopTab===0)cg.drawSkinPrev(item,cx+cW/2,pY3,26,false);
      else if(cg.shopTab===1)cg.drawTrailPrev(item,cx+cW/2,pY3);
      else cg.drawBgPrev(item,cx+8,cy+10,cW-16,46);
      ctx.restore();

      ctx.font='bold 10pt Verdana';ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillStyle=isOw?'#FFFFFF':'rgba(255,255,255,0.5)';
      ctx.fillText(item.name,cx+cW/2,cy+cH-32);

      if(isEq){ctx.font='bold 9pt Verdana';ctx.fillStyle='#88FF88';ctx.fillText('EQUIPPED',cx+cW/2,cy+cH-15);}
      else if(isOw){ctx.font='9pt Verdana';ctx.fillStyle='rgba(255,255,255,0.42)';ctx.fillText('tap to equip',cx+cW/2,cy+cH-15);}
      else{
        cg.drawCoinIcon(cx+cW/2-18,cy+cH-18,7);
        ctx.font='bold 10pt Verdana';ctx.textAlign='left';
        ctx.fillStyle=canBuy?'#FFD700':'#995500';ctx.fillText(item.cost,cx+cW/2-8,cy+cH-14);
      }
      cg.reg('item'+idx,cx+3,cy+3,cW-6,cH-6);

      /* ⓘ info button — skins only */
      if(cg.shopTab===0&&item.desc){
        var ir=8,ix=cx+cW-8,iy=cy+8;
        var iHov=cg.hovR==='info'+idx;
        ctx.save();
        ctx.beginPath();ctx.arc(ix,iy,ir,0,Math.PI*2);
        ctx.fillStyle=iHov?'rgba(100,180,255,0.9)':'rgba(80,140,220,0.7)';ctx.fill();
        ctx.font='bold 8pt Verdana';ctx.fillStyle='#FFFFFF';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('i',ix,iy+1);
        ctx.restore();
        cg.reg('info'+idx,ix-ir,iy-ir,ir*2,ir*2);
      }
    }

    /* ── Info overlay ──────────────────────────────────── */
    if(cg.shopInfoSkin){
      var s=cg.shopInfoSkin;
      ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(0,0,W,H);
      ctx.save();
      cg.drawSkinPrev(s,W/2,H/2-80,48,false);
      ctx.font='bold 20pt Verdana';ctx.fillStyle=s.glow;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.shadowColor=s.glow;ctx.shadowBlur=12;ctx.fillText(s.name,W/2,H/2-10);ctx.shadowBlur=0;
      ctx.font='bold 13pt Verdana';ctx.fillStyle='#FFD700';ctx.fillText(s.perk,W/2,H/2+25);
      ctx.font='12pt Verdana';ctx.fillStyle='rgba(255,255,255,0.8)';
      /* word-wrap desc */
      var words=s.desc.split(' '),line='',lines=[],maxW=W*0.7;
      for(var wi=0;wi<words.length;wi++){
        var test=line+(line?' ':'')+words[wi];
        if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=words[wi];}else{line=test;}
      }
      if(line)lines.push(line);
      for(var li=0;li<lines.length;li++)ctx.fillText(lines[li],W/2,H/2+55+li*22);
      ctx.font='12pt Verdana';ctx.fillStyle='rgba(255,255,255,0.45)';ctx.fillText('tap anywhere to close',W/2,H/2+130);
      ctx.restore();
      cg.reg('closeInfo',0,0,W,H);
    }

    ctx.restore();
  },

  /* ── Death screen ───────────────────────────────────────── */
  drawDead:function(){
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    cg.clickRegions=[];
    var shk=cg.shakeTime>0;
    if(shk){ctx.save();ctx.translate((Math.random()-0.5)*cg.shakeAmt,(Math.random()-0.5)*cg.shakeAmt);cg.shakeAmt*=0.82;cg.shakeTime--;}

    ctx.fillStyle='rgba(0,0,0,0.76)';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';

    ctx.font='bold 52pt Verdana';ctx.shadowColor='#FF2222';ctx.shadowBlur=26;
    ctx.fillStyle='#FF4444';ctx.fillText('YOU DIED',W/2,H*0.33);ctx.shadowBlur=0;

    ctx.font='bold 30pt Verdana';ctx.fillStyle='#FFD700';ctx.fillText(cg.deathPts+' pts',W/2,H*0.43);

    if(cg.isNewBest){
      ctx.font='bold 16pt Verdana';ctx.fillStyle='#44FF88';
      ctx.shadowColor='#44FF88';ctx.shadowBlur=12;ctx.fillText('NEW BEST!',W/2,H*0.49);ctx.shadowBlur=0;
    }

    ctx.font='15pt Verdana';ctx.fillStyle='#FFFFFF';
    cg.drawCoinIcon(W/2-80,H*0.535,11);
    ctx.textAlign='left';
    ctx.fillText('+'+cg.deathCoins+' coins  (total: '+save.coins+')',W/2-63,H*0.537);
    ctx.textAlign='center';

    var aY=H*0.605;
    for(var i=0;i<cg.newAchs.length&&i<2;i++){
      ctx.font='bold 11pt Verdana';ctx.fillStyle='#FFD700';
      ctx.shadowColor='#FF8C00';ctx.shadowBlur=8;
      ctx.fillText('ACHIEVEMENT: '+cg.newAchs[i].name+' — '+cg.newAchs[i].desc,W/2,aY);
      ctx.shadowBlur=0;aY+=22;
    }
    ctx.restore();

    var bW=Math.min(165,W*0.38),bH=48,gap=12;
    var bTotW=bW*2+gap,bX=W/2-bTotW/2,bY=H*0.77;

    ctx.save();
    ctx.fillStyle=cg.hovR==='pa'?'rgba(0,120,220,0.85)':'rgba(0,80,170,0.7)';
    ctx.shadowColor='#00BFFF';ctx.shadowBlur=cg.hovR==='pa'?18:6;
    cg.rr(bX,bY-bH/2,bW,bH,10);ctx.shadowBlur=0;
    ctx.font='bold 13pt Verdana';ctx.fillStyle='#FFFFFF';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('PLAY AGAIN',bX+bW/2,bY);
    ctx.restore();cg.reg('pa',bX,bY-bH/2,bW,bH);

    ctx.save();
    ctx.fillStyle=cg.hovR==='mn'?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.08)';
    cg.rr(bX+bW+gap,bY-bH/2,bW,bH,10);
    ctx.font='bold 13pt Verdana';ctx.fillStyle='#FFFFFF';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('MENU',bX+bW+gap+bW/2,bY);
    ctx.restore();cg.reg('mn',bX+bW+gap,bY-bH/2,bW,bH);

    if(shk)ctx.restore();
  },

  /* ── Paused ─────────────────────────────────────────────── */
  drawPaused:function(){
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    cg.clickRegions=[];
    ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='bold 44pt Verdana';ctx.shadowColor='#00BFFF';ctx.shadowBlur=18;
    ctx.fillStyle='#FFFFFF';ctx.fillText('PAUSED',W/2,H*0.38);ctx.shadowBlur=0;
    ctx.font='15pt Verdana';ctx.fillStyle='#AAAAAA';ctx.fillText('SPACE to continue',W/2,H*0.47);

    /* buttons */
    var bW=Math.min(180,W*0.42),bH=46,gap=12,bY=H*0.6;
    var bTot=bW*2+gap,bX=W/2-bTot/2;

    /* Resume */
    ctx.save();
    ctx.fillStyle=cg.hovR==='resume'?'rgba(0,160,80,0.85)':'rgba(0,110,55,0.7)';
    ctx.shadowColor='#00FF88';ctx.shadowBlur=cg.hovR==='resume'?14:4;
    cg.rr(bX,bY-bH/2,bW,bH,10);ctx.shadowBlur=0;
    ctx.font='bold 13pt Verdana';ctx.fillStyle='#FFFFFF';ctx.fillText('RESUME',bX+bW/2,bY);
    ctx.restore();cg.reg('resume',bX,bY-bH/2,bW,bH);

    /* Restart */
    ctx.save();
    ctx.fillStyle=cg.hovR==='prestart'?'rgba(200,120,0,0.85)':'rgba(140,80,0,0.7)';
    ctx.shadowColor='#FFAA00';ctx.shadowBlur=cg.hovR==='prestart'?14:4;
    cg.rr(bX+bW+gap,bY-bH/2,bW,bH,10);ctx.shadowBlur=0;
    ctx.font='bold 13pt Verdana';ctx.fillStyle='#FFFFFF';ctx.fillText('RESTART',bX+bW+gap+bW/2,bY);
    ctx.restore();cg.reg('prestart',bX+bW+gap,bY-bH/2,bW,bH);

    /* Main Menu */
    var mW=bW*2+gap,mY=bY+bH+14;
    ctx.save();
    ctx.fillStyle=cg.hovR==='pmenu'?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.08)';
    cg.rr(W/2-mW/2,mY-bH/2,mW,bH,10);
    ctx.font='bold 13pt Verdana';ctx.fillStyle='#DDDDDD';ctx.fillText('MAIN MENU',W/2,mY);
    ctx.restore();cg.reg('pmenu',W/2-mW/2,mY-bH/2,mW,bH);

    ctx.font='11pt Verdana';ctx.fillStyle='rgba(255,255,255,0.25)';
    ctx.fillText('ESC or SPACE = pause / unpause',W/2,mY+bH*0.85);
    ctx.restore();
  },

  /* ── Milestones ─────────────────────────────────────────── */
  checkMilestone:function(score){
    var ts=[5,10,20,30,50,75,100];
    var ms=['Growing!','Nice!','On Fire!','Unstoppable!','BEAST MODE!','LEGENDARY!','GOAT!'];
    for(var i=0;i<ts.length;i++){
      if(score>=ts[i]&&!cg.milestonesHit[ts[i]]){
        cg.milestonesHit[ts[i]]=true;
        cg.milestone={text:ms[i],alpha:1.4,y:cg.config.height*0.42};return;
      }
    }
  },
  drawMilestone:function(){
    if(!cg.milestone||cg.milestone.alpha<=0)return;
    var m=cg.milestone,ctx=cg.ctx;
    ctx.save();ctx.globalAlpha=Math.min(1,m.alpha);
    ctx.font='bold 28pt Verdana';ctx.fillStyle='#FFD700';
    ctx.shadowColor='#FF8C00';ctx.shadowBlur=15;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(m.text,cg.config.width/2,m.y);
    ctx.restore();m.alpha-=0.013;m.y-=0.4;
  },

  /* ── Events ─────────────────────────────────────────────── */
  checkEvt:function(){
    if(cg.activeEvtId&&!cg.on(cg.activeEvtId)){cg.activeEvtId='';cg.activeEvtName='';}
    var now=Date.now();if(now<cg.nextEvt)return;
    var ev=EVTS[Math.floor(Math.random()*EVTS.length)];
    cg.activate(ev.id,ev.dur);
    cg.activeEvtId=ev.id;cg.activeEvtName=ev.name;
    if(ev.id==='golden')cg.goldenLeft=12;
    cg.eventTriggered=true;
    cg.addNot(ev.name,ev.color);
    cg.nextEvt=now+32000+Math.random()*28000;
  },

  /* ── Powerups ────────────────────────────────────────────── */
  checkPwr:function(){
    var now=Date.now();
    if(now<cg.nextPwr||cg.powerups.length>0)return;
    cg.powerups.push(new Powerup());
    cg.nextPwr=now+40000+Math.random()*35000;
  },

  /* ── Magnet ──────────────────────────────────────────────── */
  applyMagnet:function(){
    if(!cg.player)return;
    var range=(cg.skin.mag||0)+(cg.on('magnet')?200:0);
    if(!range)return;
    for(var i=0;i<cg.circles.length;i++){
      var c=cg.circles[i];if(!c)continue;
      var er=c.getEffR?c.getEffR():c.radius;
      if(er>=cg.player.radius+cg.skin.over)continue;
      var dx=cg.player.x-c.x,dy=cg.player.y-c.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>0&&dist<range){
        var f=0.22*(1-dist/range);c.vx+=dx/dist*f;c.vy+=dy/dist*f;
        var spd=Math.sqrt(c.vx*c.vx+c.vy*c.vy);
        if(spd>8){c.vx=c.vx/spd*8;c.vy=c.vy/spd*8;}
      }
    }
  },

  /* ── Frost — slows circles inside radius by 30% ─────────── */
  applyFrost:function(){
    if(!cg.player||cg.skin.id!=='frost')return;
    var range=cg.skin.mag||80;
    for(var i=0;i<cg.circles.length;i++){
      var c=cg.circles[i];if(!c)continue;
      var dx=cg.player.x-c.x,dy=cg.player.y-c.y;
      var dist=Math.sqrt(dx*dx+dy*dy);
      c._frosted=(dist<range);
    }
  },

  /* ── Swarm trail — mini helper circles ──────────────────── */
  tickSwarm:function(){
    var t=cg.trail||getTrail('none');
    if(t.id!=='swarm'||!cg.player)return;
    /* spawn up to 3 minions */
    while(cg.swarmMinions.length<3){
      var a=Math.random()*Math.PI*2;
      cg.swarmMinions.push({x:cg.player.x+Math.cos(a)*85,y:cg.player.y+Math.sin(a)*85,
        vx:0,vy:0,angle:a,radius:9});
    }
    for(var i=cg.swarmMinions.length-1;i>=0;i--){
      var m=cg.swarmMinions[i];
      /* drift toward orbit distance ~85 from player */
      var dx2=cg.player.x-m.x,dy2=cg.player.y-m.y;
      var dist2=Math.sqrt(dx2*dx2+dy2*dy2);
      var target=85;
      if(dist2>target+20){m.vx+=dx2/dist2*0.28;m.vy+=dy2/dist2*0.28;}
      else if(dist2<target-20){m.vx-=dx2/dist2*0.28;m.vy-=dy2/dist2*0.28;}
      m.angle+=0.018;m.vx+=Math.cos(m.angle)*0.08;m.vy+=Math.sin(m.angle)*0.08;
      var spd2=Math.sqrt(m.vx*m.vx+m.vy*m.vy);
      if(spd2>2.8){m.vx=m.vx/spd2*2.8;m.vy=m.vy/spd2*2.8;}
      m.x+=m.vx*elapsed/15;m.y+=m.vy*elapsed/15;
      /* collide with circles */
      var dead=false;
      for(var j=cg.circles.length-1;j>=0;j--){
        var c2=cg.circles[j];if(!c2)continue;
        var er2=c2.getEffR?c2.getEffR():c2.radius;
        var cdx=m.x-c2.x,cdy=m.y-c2.y;
        if(Math.sqrt(cdx*cdx+cdy*cdy)<m.radius+er2){
          if(er2<cg.player.radius){
            cg.spawnP(c2.x,c2.y,c2.color,5);
            cg.player.radius+=0.4;cg.circles.splice(j,1);
          } else {cg.spawnP(m.x,m.y,'#9999CC',8);dead=true;break;}
        }
      }
      if(dead){cg.swarmMinions.splice(i,1);continue;}
      /* render minion */
      var ctx2=cg.ctx;
      ctx2.save();ctx2.shadowColor='#9999CC';ctx2.shadowBlur=10;
      var g2=ctx2.createRadialGradient(m.x,m.y,0,m.x,m.y,m.radius);
      g2.addColorStop(0,'#FFFFFF');g2.addColorStop(0.5,'#AAAADD');g2.addColorStop(1,'#333355');
      ctx2.beginPath();ctx2.arc(m.x,m.y,m.radius,0,Math.PI*2);
      ctx2.fillStyle=g2;ctx2.fill();ctx2.restore();
    }
  },

  /* ── Achievements screen ─────────────────────────────────── */
  drawAchs:function(){
    var ctx=cg.ctx,W=cg.config.width,H=cg.config.height;
    cg.clickRegions=[];
    if(!save.claimedAchs)save.claimedAchs=[];
    ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,W,H);
    ctx.save();
    /* back */
    ctx.font='bold 13pt Verdana';ctx.fillStyle=cg.hovR==='achback'?'#FFFFFF':'rgba(255,255,255,0.65)';
    ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('← BACK',18,28);cg.reg('achback',10,14,100,28);
    /* title */
    ctx.font='bold 24pt Verdana';ctx.fillStyle='#FFFFFF';ctx.textAlign='center';
    ctx.fillText('ACHIEVEMENTS',W/2,28);
    /* coins */
    cg.drawCoinIcon(W-74,26,11);
    ctx.font='bold 15pt Verdana';ctx.fillStyle='#FFD700';ctx.textAlign='left';ctx.fillText(save.coins,W-58,26);

    var rowH=58,gY=55,padding=12;
    for(var i=0;i<ACHS.length;i++){
      var a=ACHS[i];
      var done=save.achievements.indexOf(a.id)>=0;
      var claimed=save.claimedAchs.indexOf(a.id)>=0;
      var ry=gY+i*rowH;
      if(ry+rowH>H-10)break; /* don't overflow screen */

      /* row bg */
      ctx.fillStyle=done?(claimed?'rgba(255,255,255,0.05)':'rgba(255,215,0,0.1)'):'rgba(255,255,255,0.03)';
      cg.rr(padding,ry,W-padding*2,rowH-4,8);

      /* status dot */
      ctx.beginPath();ctx.arc(padding+16,ry+rowH/2-2,8,0,Math.PI*2);
      ctx.fillStyle=done?(claimed?'#44AA44':'#FFD700'):'#333333';ctx.fill();
      if(done&&!claimed){
        ctx.font='bold 7pt Verdana';ctx.fillStyle='#000';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('!',padding+16,ry+rowH/2-2);
      }

      /* name + desc */
      ctx.textAlign='left';ctx.textBaseline='top';
      ctx.font='bold 11pt Verdana';ctx.fillStyle=done?'#FFFFFF':'rgba(255,255,255,0.38)';
      ctx.fillText(a.name,padding+32,ry+8);
      ctx.font='9pt Verdana';ctx.fillStyle='rgba(255,255,255,0.45)';
      ctx.fillText(a.desc,padding+32,ry+26);

      /* coins reward */
      cg.drawCoinIcon(W-padding-56,ry+rowH/2-2,8);
      ctx.font='bold 10pt Verdana';ctx.fillStyle=done?'#FFD700':'rgba(255,215,0,0.3)';
      ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText('+'+a.coins,W-padding-44,ry+rowH/2-2);

      /* claim button */
      if(done&&!claimed){
        var bw=52,bh=22,bx=W-padding-bw-2,by=ry+rowH/2-bh/2-2;
        var chov=cg.hovR==='claim'+a.id;
        ctx.fillStyle=chov?'rgba(255,200,0,0.9)':'rgba(200,150,0,0.7)';
        ctx.shadowColor='#FFD700';ctx.shadowBlur=chov?8:0;
        cg.rr(bx,by,bw,bh,6);ctx.shadowBlur=0;
        ctx.font='bold 8pt Verdana';ctx.fillStyle='#000';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('CLAIM',bx+bw/2,by+bh/2);
        cg.reg('claim'+a.id,bx,by,bw,bh);
      } else if(claimed){
        ctx.font='9pt Verdana';ctx.fillStyle='rgba(100,200,100,0.7)';
        ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText('✓ claimed',W-padding-4,ry+rowH/2-2);
      }
    }
    ctx.restore();
  },

  checkAchs:function(){
    cg.newAchs=[];
    if(!save.claimedAchs)save.claimedAchs=[];
    var sc=cg.deathPts,ec=cg.eatCount;
    var chk={
      first:true, devourer:ec>=10, bigScore:sc>=30,
      rich:save.coins>=100, veteran:(save.runs||0)>=10,
      score50:sc>=50, score100:sc>=100, score200:sc>=200,
      score500:sc>=500, score1000:sc>=1000, goat5k:sc>=5000,
      golden5:cg.goldenEaten>=5, powerup3:cg.powerupsCollected>=3,
      runs25:(save.runs||0)>=25, runs100:(save.runs||0)>=100,
      eat50:ec>=50, noHit:sc>=20&&cg.shieldAbsorbs===0,
      shop3:save.unlocked.length>=6, eventRider:cg.eventTriggered
    };
    for(var i=0;i<ACHS.length;i++){
      var a=ACHS[i];
      if(chk[a.id]&&save.achievements.indexOf(a.id)<0){
        save.achievements.push(a.id);
        cg.newAchs.push(a);
        /* auto-claim cheap ones silently; big ones stay unclaimed for user to claim */
      }
    }
  },

  /* ── Particles ────────────────────────────────────────────── */
  spawnP:function(x,y,color,count){
    for(var i=0;i<count;i++){
      var a=Math.random()*Math.PI*2,spd=Math.random()*5+1;
      cg.particles.push({x:x,y:y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:Math.random()*3+1,color:color,alpha:1});
    }
  },
  tickP:function(){
    for(var i=cg.particles.length-1;i>=0;i--){
      var p=cg.particles[i];
      p.x+=p.vx*elapsed/15;p.y+=p.vy*elapsed/15;
      p.vx*=0.94;p.vy*=0.94;p.alpha-=0.04;
      if(p.alpha<=0){cg.particles.splice(i,1);continue;}
      cg.ctx.save();cg.ctx.globalAlpha=p.alpha;
      cg.ctx.shadowColor=p.color;cg.ctx.shadowBlur=8;
      cg.ctx.beginPath();cg.ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cg.ctx.fillStyle=p.color;cg.ctx.fill();cg.ctx.restore();
    }
  },

  /* ── Notifications ────────────────────────────────────────── */
  addNot:function(text,color){
    cg.notifications=[{text:text,color:color||'#FFFFFF',alpha:1.6,y:cg.config.height*0.26}];
  },
  tickNots:function(){
    for(var i=cg.notifications.length-1;i>=0;i--){
      var n=cg.notifications[i];n.alpha-=0.011;n.y-=0.25;
      if(n.alpha<=0){cg.notifications.splice(i,1);continue;}
      cg.ctx.save();cg.ctx.globalAlpha=Math.min(1,n.alpha);
      cg.ctx.font='bold 17pt Verdana';cg.ctx.fillStyle=n.color;
      cg.ctx.shadowColor=n.color;cg.ctx.shadowBlur=12;
      cg.ctx.textAlign='center';cg.ctx.textBaseline='middle';
      cg.ctx.fillText(n.text,cg.config.width/2,n.y);cg.ctx.restore();
    }
  },

  /* ── Clicks / hover ───────────────────────────────────────── */
  reg:function(id,x,y,w,h){cg.clickRegions.push({id:id,x:x,y:y,w:w,h:h});},
  updateHov:function(){
    cg.hovR=null;var mx=cg.mouseX,my=cg.mouseY;
    for(var i=0;i<cg.clickRegions.length;i++){
      var r=cg.clickRegions[i];
      if(mx>=r.x&&mx<=r.x+r.w&&my>=r.y&&my<=r.y+r.h){cg.hovR=r.id;break;}
    }
    var sc=cg.screen;
    /* During play/pause the player circle IS the cursor — always hide the system cursor */
    if(sc==='playing'||sc==='paused'){$(cg.canvas).css('cursor','none');return;}
    $(cg.canvas).css('cursor',(sc==='menu'||sc==='shop'||sc==='dead'||sc==='achievements')&&cg.hovR?'pointer':'default');
  },
  onClick:function(x,y){
    var clicked=null;
    for(var i=0;i<cg.clickRegions.length;i++){
      var r=cg.clickRegions[i];
      if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){clicked=r.id;break;}
    }
    if(cg.screen==='menu'){
      if(clicked==='play'){cg.start();return;}
      if(clicked==='shop'){cg.screen='shop';cg.shopTab=0;cg.shopInfoSkin=null;return;}
      if(clicked==='achmenu'){cg.screen='achievements';return;}
      var os=cg.oSkins();
      if(clicked==='skinL'){cg.menuSkinIdx=(cg.menuSkinIdx-1+os.length)%os.length;save.skin=os[cg.menuSkinIdx%os.length].id;cg.skin=getSkin(save.skin);writeSave();}
      if(clicked==='skinR'){cg.menuSkinIdx=(cg.menuSkinIdx+1)%os.length;save.skin=os[cg.menuSkinIdx%os.length].id;cg.skin=getSkin(save.skin);writeSave();}
      var ot=cg.oTrails();
      if(clicked==='trailL'){cg.menuTrailIdx=(cg.menuTrailIdx-1+ot.length)%ot.length;save.trail=ot[cg.menuTrailIdx%ot.length].id;writeSave();}
      if(clicked==='trailR'){cg.menuTrailIdx=(cg.menuTrailIdx+1)%ot.length;save.trail=ot[cg.menuTrailIdx%ot.length].id;writeSave();}
      var ob=cg.oBgs();
      if(clicked==='bgL'){cg.menuBgIdx=(cg.menuBgIdx-1+ob.length)%ob.length;save.bg=ob[cg.menuBgIdx%ob.length].id;cg.bg=getBg(save.bg);writeSave();}
      if(clicked==='bgR'){cg.menuBgIdx=(cg.menuBgIdx+1)%ob.length;save.bg=ob[cg.menuBgIdx%ob.length].id;cg.bg=getBg(save.bg);writeSave();}
    }
    else if(cg.screen==='shop'){
      /* info overlay close */
      if(cg.shopInfoSkin){cg.shopInfoSkin=null;return;}
      if(clicked==='back'){cg.screen='menu';return;}
      if(clicked&&clicked.indexOf('closeInfo')===0){cg.shopInfoSkin=null;return;}
      if(clicked&&clicked.indexOf('info')===0&&clicked!=='info'){
        var idx2=parseInt(clicked.substring(4));
        var rawI=cg.shopTab===0?SKINS:cg.shopTab===1?TRAILS:BACKGROUNDS;
        var visI=rawI.filter(function(it){return !it.ach;});
        if(visI[idx2])cg.shopInfoSkin=visI[idx2];return;
      }
      if(clicked&&clicked.indexOf('tab')===0){cg.shopTab=parseInt(clicked.charAt(3));return;}
      if(clicked&&clicked.indexOf('item')===0){
        var idx=parseInt(clicked.substring(4));
        var rawItems=cg.shopTab===0?SKINS:cg.shopTab===1?TRAILS:BACKGROUNDS;
        var visItems=rawItems.filter(function(it){return !it.ach;});
        var item=visItems[idx];if(!item)return;
        if(!isOwned(item.id)){
          if(save.coins>=item.cost){
            save.coins-=item.cost;save.unlocked.push(item.id);
            if(cg.shopTab===0){save.skin=item.id;cg.skin=getSkin(item.id);}
            else if(cg.shopTab===1){save.trail=item.id;}
            else{save.bg=item.id;cg.bg=getBg(item.id);}
            writeSave();cg.addNot(item.name+' unlocked!','#FFD700');
          } else {cg.addNot('Need '+(item.cost-save.coins)+' more coins!','#FF4444');}
        } else {
          if(cg.shopTab===0){save.skin=item.id;cg.skin=getSkin(item.id);}
          else if(cg.shopTab===1){save.trail=item.id;}
          else{save.bg=item.id;cg.bg=getBg(item.id);}
          writeSave();
        }
      }
    }
    else if(cg.screen==='achievements'){
      if(clicked==='achback'){cg.screen='menu';return;}
      if(clicked&&clicked.indexOf('claim')===0){
        var aid=clicked.substring(5);
        if(!save.claimedAchs)save.claimedAchs=[];
        if(save.achievements.indexOf(aid)>=0&&save.claimedAchs.indexOf(aid)<0){
          save.claimedAchs.push(aid);
          for(var ai=0;ai<ACHS.length;ai++){
            if(ACHS[ai].id===aid){
              save.coins+=ACHS[ai].coins;
              cg.addNot('+'+ACHS[ai].coins+' coins claimed!','#FFD700');
              if(ACHS[ai].unlock&&save.unlocked.indexOf(ACHS[ai].unlock)<0){
                save.unlocked.push(ACHS[ai].unlock);
                cg.addNot(ACHS[ai].unlock+' trail unlocked!','#FF88FF');
              }
              break;
            }
          }
          writeSave();
        }
      }
    }
    else if(cg.screen==='dead'){
      if(clicked==='pa')cg.start();
      else if(clicked==='mn'||!clicked)cg.screen='menu';
    }
    else if(cg.screen==='paused'){
      if(clicked==='resume'){cg.unpause();}
      else if(clicked==='prestart'){cg.screen='playing';cg.start();}
      else if(clicked==='pmenu'){
        $(cg.canvas).css('cursor','default');
        cg.screen='menu';cg.player=null;
        $(window).unbind('keydown');
        $(window).keydown(function(e){
          if(e.keyCode===32&&(cg.screen==='playing'||cg.screen==='paused')){cg.togglePause();e.preventDefault();}
          if(e.keyCode===27&&(cg.screen==='playing'||cg.screen==='paused')){cg.pause();e.preventDefault();}
        });
      }
    }
  },

  /* ── Draw helpers ─────────────────────────────────────────── */
  drawSkinPrev:function(skin,x,y,r,pulse){
    var pr=r+(pulse?Math.sin(Date.now()/500)*1.5:0),ctx=cg.ctx;
    ctx.save();ctx.shadowColor=skin.glow;ctx.shadowBlur=14;
    var g=ctx.createRadialGradient(x-pr*0.3,y-pr*0.35,pr*0.05,x,y,pr);
    g.addColorStop(0,skin.c1);g.addColorStop(0.5,skin.c2);g.addColorStop(1,skin.c3);
    ctx.beginPath();ctx.arc(x,y,pr,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  },
  drawTrailPrev:function(trail,x,y){
    var ctx=cg.ctx;ctx.save();
    if(trail.id==='none'){
      ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=2;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(x-24,y);ctx.lineTo(x+24,y);ctx.stroke();ctx.setLineDash([]);
    } else {
      for(var k=-2;k<=2;k++){
        var px=x+k*10,py=y+Math.sin(k*0.9)*7,pr2=4-Math.abs(k)*0.5;
        var tc2=trail.color==='rainbow'?'hsl('+(k+2)*60+',100%,60%)':trail.color;
        ctx.beginPath();ctx.arc(px,py,pr2,0,Math.PI*2);
        ctx.fillStyle=tc2;ctx.shadowColor=tc2;ctx.shadowBlur=5;ctx.fill();
      }
    }
    ctx.restore();
  },
  drawBgPrev:function(bg,x,y,w,h){
    var ctx=cg.ctx;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    if(bg.id==='space'){ctx.fillStyle='#0d0d1e';ctx.fillRect(x,y,w,h);}
    else if(bg.id==='aurora'){
      ctx.fillStyle='#050a10';ctx.fillRect(x,y,w,h);
      ctx.fillStyle='rgba(0,200,100,0.35)';
      ctx.beginPath();ctx.ellipse(x+w*0.35,y+h*0.5,w*0.35,h*0.28,0,0,Math.PI*2);ctx.fill();
    } else {
      var g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#000814');g.addColorStop(1,'#001a33');
      ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
    }
    ctx.restore();
  },
  drawArrow:function(x,y,dir,hov){
    var ctx=cg.ctx;ctx.save();ctx.fillStyle=hov?'#FFFFFF':'rgba(255,255,255,0.55)';
    ctx.font='bold 22pt Verdana';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(dir==='l'?'‹':'›',x,y);ctx.restore();
  },
  drawCoinIcon:function(x,y,r){
    var ctx=cg.ctx;ctx.save();ctx.shadowColor='#FFD700';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle='#FFD700';ctx.fill();
    ctx.shadowBlur=0;ctx.font='bold '+Math.floor(r*1.1)+'px Arial';
    ctx.fillStyle='#885500';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('$',x,y+1);ctx.restore();
  },
  rr:function(x,y,w,h,r){
    var c=cg.ctx;c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
    c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
    c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();c.fill();
  },
  rrs:function(x,y,w,h,r){
    var c=cg.ctx;c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
    c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
    c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();c.stroke();
  },
  diffScale:function(){
    if(!cg.player||!cg.skin)return 1;
    var sc=Math.max(0,cg.player.radius-cg.skin.r0);
    /* gentle ramp: +1% speed per point, capped at 60% faster. Frenzy event adds a burst. */
    return Math.min(1.6,1+sc*0.010)*(cg.on('frenzy')?1.4:1);
  }
};

/* ============================================================
   CIRCLE
============================================================ */
var Circle=function(inCenter){
  var min=cg.config.circle.minRadius,max=cg.config.circle.maxRadius;
  if(cg.player){
    if(min<cg.player.radius-35)min=cg.player.radius-35;
    if(max<cg.player.radius+15)max=cg.player.radius+15;
  }
  this.radius=rand(min,max,cg.config.circle.radiusInterval);
  this.color=cg.config.circle.colors[Math.floor(Math.random()*cg.config.circle.colors.length)];
  this.pulsePhase=Math.random()*Math.PI*2;
  this.golden=false;

  if(inCenter){
    this.x=Math.random()*cg.config.width;this.y=Math.random()*cg.config.height;
    this.vx=(Math.random()-0.5)*cg.config.circle.speedScale;
    this.vy=(Math.random()-0.5)*cg.config.circle.speedScale;
  } else {
    var d=cg.diffScale?cg.diffScale():1,r2=Math.random();
    if(r2<=0.25){this.x=-this.radius;this.y=Math.random()*cg.config.height;this.vx=Math.random();this.vy=Math.random()-0.5;}
    else if(r2<=0.5){this.x=cg.config.width+this.radius;this.y=Math.random()*cg.config.height;this.vx=-Math.random();this.vy=Math.random()-0.5;}
    else if(r2<=0.75){this.x=Math.random()*cg.config.width;this.y=-this.radius;this.vx=Math.random()-0.5;this.vy=Math.random();}
    else{this.x=Math.random()*cg.config.width;this.y=cg.config.height+this.radius;this.vx=Math.random()-0.5;this.vy=-Math.random();}
    this.vx*=cg.config.circle.speedScale*d;this.vy*=cg.config.circle.speedScale*d;
  }
  if(Math.abs(this.vx)+Math.abs(this.vy)<0.6){this.vx=this.vx>=0?0.4:-0.4;this.vy=this.vy>=0?0.4:-0.4;}

  this.getEffR=function(){return this.radius*(cg.on('tiny')?0.7:1);};
  this.tick=function(){
    if(!this.inBounds()){
      for(var i=0;i<cg.circles.length;i++)if(cg.circles[i]===this){cg.circles.splice(i,1);return true;}
    } else {this.move();this.render();}
  };
  this.inBounds=function(){
    return!(this.x+this.radius<0||this.x-this.radius>cg.config.width||this.y+this.radius<0||this.y-this.radius>cg.config.height);
  };
  this.move=function(){
    var sm=cg.on('freeze')?0.1:(this._frosted?0.7:1);
    this.x+=this.vx*elapsed/15*sm;this.y+=this.vy*elapsed/15*sm;
    this.pulsePhase+=0.035;
    this._frosted=false; /* reset each frame — applyFrost re-sets it if still in range */
  };
  this.render=function(){
    var er=this.getEffR(),r=er+Math.sin(this.pulsePhase)*1.5;
    var col=this.golden?'#FFD700':this.color,ctx=cg.ctx;

    /* danger ring — circles bigger than player pulse red */
    if(cg.player){
      var sk2=cg.skin||getSkin('classic');
      if(er>cg.player.radius+sk2.over){
        var pulse3=0.3+Math.sin(Date.now()/180)*0.18;
        ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);
        ctx.strokeStyle='rgba(255,60,60,'+pulse3+')';
        ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
    }

    ctx.save();ctx.shadowColor=this.golden?'#FF8C00':col;ctx.shadowBlur=this.golden?22:13;
    var g=ctx.createRadialGradient(this.x-r*0.3,this.y-r*0.35,r*0.1,this.x,this.y,r);
    g.addColorStop(0,this.golden?'#FFFFAA':'#FFFFFF');g.addColorStop(0.35,col);g.addColorStop(1,'rgba(0,0,0,0.4)');
    ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    if(this.golden){ctx.strokeStyle='#FFDD00';ctx.lineWidth=2;ctx.stroke();}
    ctx.restore();
  };
  this.render();
};

/* ============================================================
   POWERUP
============================================================ */
var Powerup=function(){
  this.type=PWR[Math.floor(Math.random()*PWR.length)];
  this.radius=22;this.pulsePhase=0;this.spawnTime=Date.now();this.life=14000;
  var r=Math.random();
  if(r<=0.25){this.x=-this.radius;this.y=Math.random()*cg.config.height;this.vx=1.5;this.vy=(Math.random()-0.5)*0.8;}
  else if(r<=0.5){this.x=cg.config.width+this.radius;this.y=Math.random()*cg.config.height;this.vx=-1.5;this.vy=(Math.random()-0.5)*0.8;}
  else if(r<=0.75){this.x=Math.random()*cg.config.width;this.y=-this.radius;this.vx=(Math.random()-0.5)*0.8;this.vy=1.5;}
  else{this.x=Math.random()*cg.config.width;this.y=cg.config.height+this.radius;this.vx=(Math.random()-0.5)*0.8;this.vy=-1.5;}
  this.tick=function(){
    this.x+=this.vx*elapsed/15;this.y+=this.vy*elapsed/15;this.pulsePhase+=0.08;
    if(cg.player){
      var dx=this.x-cg.player.x,dy=this.y-cg.player.y;
      if(Math.sqrt(dx*dx+dy*dy)<this.radius+cg.player.radius){
        cg.activate(this.type.id,this.type.dur);
        cg.powerupsCollected++;
        cg.addNot(this.type.name+'!',this.type.color);
        cg.spawnP(this.x,this.y,this.type.color,12);return true;
      }
    }
    if(Date.now()-this.spawnTime>this.life)return true;
    if(this.x+this.radius<0||this.x-this.radius>cg.config.width||this.y+this.radius<0||this.y-this.radius>cg.config.height)return true;
    this.render();return false;
  };
  this.render=function(){
    var t=this.type,lr=1-(Date.now()-this.spawnTime)/this.life;
    var r=this.radius+Math.sin(this.pulsePhase)*2,ctx=cg.ctx;
    ctx.save();ctx.shadowColor=t.glow;ctx.shadowBlur=18;
    ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,0.72)';ctx.fill();
    ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.strokeStyle=t.color;ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.arc(this.x,this.y,r+5,-Math.PI/2,-Math.PI/2+lr*Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.38)';ctx.lineWidth=2;ctx.stroke();
    ctx.shadowBlur=0;ctx.font='bold 8pt Verdana';ctx.fillStyle=t.color;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t.label,this.x,this.y);ctx.restore();
  };
};

/* ============================================================
   PLAYER
============================================================ */
var Player=function(){
  var sk=cg.skin;
  this.x=cg.config.width/2;this.y=cg.config.height/2;
  this.radius=sk.r0;this.orbitAngle=0;
  this.shieldHits=sk.sh;

  this.tick=function(){this.collide();this.render();};

  this.collide=function(){
    var sk2=cg.skin;
    for(var i=0;i<cg.circles.length;i++){
      var c=cg.circles[i];if(!c)continue;
      var er=c.getEffR?c.getEffR():c.radius;
      var dx=c.x-this.x,dy=c.y-this.y;
      if(Math.sqrt(dx*dx+dy*dy)>er+this.radius)continue;
      var canEat=er<=this.radius+sk2.over||cg.on('shield');
      if(!canEat){
        if(this.shieldHits>0){
          this.shieldHits--;
          cg.shieldAbsorbs++;
          cg.spawnP(this.x,this.y,'#FFD700',12);
          cg.addNot('Shield Absorbed!','#FFD700');
          cg.circles.splice(i,1);i--;
        } else {cg.death();return;}
      } else {
        cg.spawnP(c.x,c.y,c.golden?'#FFD700':c.color,8);
        if(c.golden){
          cg.goldenEaten++;
          var gc2=cg.on('coins')?6:3;save.coins+=gc2;writeSave();cg.addNot('+'+gc2+' coins!','#FFD700');
        }
        this.radius+=sk2.eat*(cg.on('double')?2:1);
        cg.eatCount++;
        cg.checkMilestone(Math.max(0,this.radius-sk2.r0));
        cg.circles.splice(i,1);i--;
      }
    }
  };

  this.render=function(){
    var sk2=cg.skin;
    var r=this.radius,ctx=cg.ctx;

    if(sk2.mag||cg.on('magnet')){
      var mr=(sk2.mag||0)+(cg.on('magnet')?200:0);
      ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,mr,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,215,0,0.055)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    }
    if(sk2.id==='magnet'||cg.on('magnet')){
      this.orbitAngle+=0.045;ctx.save();
      ctx.shadowColor='#FFD700';ctx.shadowBlur=6;ctx.fillStyle='#FFD700';
      for(var d=0;d<3;d++){
        var a=this.orbitAngle+d*Math.PI*2/3;
        ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+11),this.y+Math.sin(a)*(r+11),2.5,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
    if(cg.on('freeze')){
      ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);
      ctx.strokeStyle='rgba(150,220,255,0.45)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    }

    /* main circle */
    ctx.save();ctx.shadowColor=sk2.glow;ctx.shadowBlur=22;
    var g=ctx.createRadialGradient(this.x-r*0.3,this.y-r*0.35,r*0.05,this.x,this.y,r);
    g.addColorStop(0,sk2.c1);g.addColorStop(0.5,sk2.c2);g.addColorStop(1,sk2.c3);
    ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.32)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();

    /* shield skin ring — disappears when hit */
    if(sk2.id==='shield'&&this.shieldHits>0){
      ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);
      ctx.strokeStyle='#00AAFF';ctx.lineWidth=3;ctx.shadowColor='#00AAFF';ctx.shadowBlur=12;ctx.stroke();ctx.restore();
    }
    /* powerup shield ring */
    if(cg.on('shield')){
      ctx.save();ctx.beginPath();ctx.arc(this.x,this.y,r+14,0,Math.PI*2);
      ctx.strokeStyle='rgba(68,170,255,0.7)';ctx.lineWidth=2;ctx.shadowColor='#0066FF';ctx.shadowBlur=10;ctx.stroke();ctx.restore();
    }
  };
};
