const { useState, useRef, useCallback, useEffect } = React;

/* ────────────────────────────────────────
   Sample Data
──────────────────────────────────────── */
const SAMPLE = {
  name: "Aryan Mehta",
  phone: "+91 98765 43210",
  email: "aryan.mehta@gmail.com",
  linkedin: "linkedin.com/in/aryanmehta",
  github: "github.com/aryanmehta",
  photo: null,
  objective: "Passionate software engineer with 2+ years of experience building scalable web applications. Adept at translating complex requirements into elegant, performant code. Seeking to contribute deep technical expertise and creative problem-solving to a forward-thinking engineering team.",
  education: [
    { id: "e1", type: "school", schoolName: "Delhi Public School, R.K. Puram", class10: "94.2", class12: "91.6", passoutYear: "2020" },
    { id: "e2", type: "college", degreeName: "B.Tech Computer Science", college: "IIT Bombay", yearOfStudy: "2020 – 2024", cgpa: "8.7" },
  ],
  skills: {
    technical: ["React.js","Node.js","GraphQL","PostgreSQL","Redis","Docker","AWS"],
    languages: ["JavaScript","TypeScript","Python","Java","C++","SQL"],
  },
  projects: [
    { id: "p1", name: "DevCollab – Real-time Code Editor", technologies: ["React","Socket.io","Node.js","Monaco"], description: "Collaborative editor supporting 50+ simultaneous users with real-time sync, syntax highlighting for 30 languages, and WebRTC video chat." },
    { id: "p2", name: "FinTrack – Finance Dashboard", technologies: ["Next.js","Prisma","Stripe API","Chart.js"], description: "Full-stack finance tracker with bank-level encryption, automated categorization of 1000+ transactions/sec, and ML-powered spend predictions." },
  ],
  experience: [
    { id: "x1", jobTitle: "Software Engineering Intern", company: "Razorpay", duration: "June 2023 – Aug 2023", responsibilities: "Optimized payment checkout flow reducing drop-off by 18%. Implemented A/B testing serving 2M+ users. Migrated jQuery to React, improving LCP by 40%." },
    { id: "x2", jobTitle: "Full Stack Developer", company: "Startup Studio (Freelance)", duration: "Jan 2024 – Present", responsibilities: "Architected 4 production SaaS products. Built CI/CD pipelines reducing deploy time by 65%. Mentored 3 junior developers on best practices." },
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate (2024)",
    "Google Cloud Professional Data Engineer (2023)",
    "Meta Frontend Developer Professional Certificate (2022)",
  ],
  achievements: [
    "Winner – Smart India Hackathon 2023 (National Level)",
    "Top 1% contributor on LeetCode (2800+ problems solved)",
    "Open Source: 200+ GitHub stars on personal projects",
  ],
  languagesKnown: ["English","Hindi","Marathi"],
  hobbies: ["Open Source","UI/UX Design","Chess","Hiking"],
};

const uid = () => Math.random().toString(36).slice(2,8);

/* ────────────────────────────────────────
   SVG Icons
──────────────────────────────────────── */
const icons = {
  user:       `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  phone:      `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
  mail:       `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
  linkedin:   `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
  github:     `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>`,
  chevronDown:`<path d="m6 9 6 6 6-6"/>`,
  plus:       `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  trash:      `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>`,
  download:   `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  sun:        `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,
  moon:       `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  camera:     `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>`,
  x:          `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  check:      `<polyline points="20 6 9 17 4 12"/>`,
  award:      `<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>`,
  globe:      `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  file:       `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  layers:     `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
  briefcase:  `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  graduation: `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
  code:       `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  zap:        `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  book:       `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
  layout:     `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`,
  eye:        `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
};

function Ic({ n, size=14, color="currentColor", style={} }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={style}
      dangerouslySetInnerHTML={{ __html: icons[n] || "" }}
    />
  );
}

/* ────────────────────────────────────────
   Accordion
──────────────────────────────────────── */
function Accordion({ iconName, title, children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion${open ? " open" : ""}`}>
      <button className="acc-header" onClick={() => setOpen(o => !o)}>
        <span className="acc-icon-label">
          <Ic n={iconName} size={14} color="var(--t2)" />
          {title}
        </span>
        <Ic n="chevronDown" size={13} color="var(--t3)" style={{transition:"transform 0.2s", transform: open?"rotate(180deg)":"rotate(0deg)"}} />
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}

/* ────────────────────────────────────────
   Field
──────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div className="field">
      {label && <span className="field-label">{label}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Area({ label, value, onChange, rows=3 }) {
  return (
    <div className="field">
      {label && <span className="field-label">{label}</span>}
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  );
}

/* ────────────────────────────────────────
   TagInput
──────────────────────────────────────── */
function TagInput({ label, tags, onChange, placeholder="Type & press Enter" }) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setVal("");
  };
  return (
    <div className="field">
      {label && <span className="field-label">{label}</span>}
      {tags.length > 0 && (
        <div className="tags-wrap" style={{marginBottom:6}}>
          {tags.map(t => (
            <span key={t} className="tag">
              {t}
              <button className="tag-remove" onClick={()=>onChange(tags.filter(x=>x!==t))}>
                <Ic n="x" size={9} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="tag-row">
        <input value={val} onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); }}}
          placeholder={placeholder} />
        <button className="btn btn-outline btn-icon" onClick={add}><Ic n="plus" size={12} color="var(--acc)"/></button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   ListInput
──────────────────────────────────────── */
function ListInput({ items, onChange, placeholder }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {items.map((item, i) => (
        <div key={i} className="list-row">
          <input value={item} placeholder={placeholder}
            onChange={e=>{ const n=[...items]; n[i]=e.target.value; onChange(n); }} />
          <button className="btn btn-danger btn-icon btn-sm"
            onClick={()=>onChange(items.filter((_,j)=>j!==i))}>
            <Ic n="trash" size={11}/>
          </button>
        </div>
      ))}
      <button className="btn btn-outline btn-sm" style={{alignSelf:"flex-start"}}
        onClick={()=>onChange([...items,""])}>
        <Ic n="plus" size={11} color="var(--acc)"/> Add item
      </button>
    </div>
  );
}

/* ════════════════════════════════════════
   TEMPLATE 1 — Modern Minimalist
════════════════════════════════════════ */
function T1({ data }) {
  return (
    <div className="t1">
      <div className="t1-head">
        <div style={{flex:1}}>
          <div className="t1-name">{data.name||"Your Name"}</div>
          <div className="t1-contacts">
            {data.email    && <span className="t1-contact-item"><Ic n="mail"     size={9} color="#bbb"/>{data.email}</span>}
            {data.phone    && <span className="t1-contact-item"><Ic n="phone"    size={9} color="#bbb"/>{data.phone}</span>}
            {data.linkedin && <span className="t1-contact-item"><Ic n="linkedin" size={9} color="#bbb"/>{data.linkedin}</span>}
            {data.github   && <span className="t1-contact-item"><Ic n="github"   size={9} color="#bbb"/>{data.github}</span>}
          </div>
        </div>
        {data.photo
          ? <img src={data.photo} alt="" className="t1-photo"/>
          : <div className="t1-photo-ph"><Ic n="user" size={28} color="#ccc"/></div>}
      </div>

      {data.objective && <p className="t1-objective">{data.objective}</p>}

      <div className="t1-cols">
        <div className="t1-left">
          {(data.skills.technical.length>0||data.skills.languages.length>0) && (
            <div>
              <div className="t1-sec-title">Skills</div>
              {data.skills.technical.length>0 && (
                <div className="t1-skill-group">
                  <div className="t1-skill-group-label">Technical</div>
                  {data.skills.technical.map(s=><span key={s} className="t1-chip">{s}</span>)}
                </div>
              )}
              {data.skills.languages.length>0 && (
                <div className="t1-skill-group">
                  <div className="t1-skill-group-label">Languages</div>
                  {data.skills.languages.map(s=><span key={s} className="t1-chip">{s}</span>)}
                </div>
              )}
            </div>
          )}

          {data.education.length>0 && (
            <div>
              <div className="t1-sec-title">Education</div>
              {data.education.map(e=>(
                <div key={e.id} className="t1-edu-item">
                  {e.type==="college"
                    ? <><div className="t1-edu-deg">{e.degreeName}</div><div className="t1-edu-inst">{e.college}</div><div className="t1-edu-meta">{e.yearOfStudy} · CGPA {e.cgpa}</div></>
                    : <><div className="t1-edu-deg">{e.schoolName}</div><div className="t1-edu-inst">X: {e.class10}% · XII: {e.class12}%</div><div className="t1-edu-meta">Passed {e.passoutYear}</div></>
                  }
                </div>
              ))}
            </div>
          )}

          {data.languagesKnown.length>0 && (
            <div>
              <div className="t1-sec-title">Spoken Languages</div>
              <div style={{fontSize:10.5,color:"#666"}}>{data.languagesKnown.join(" · ")}</div>
            </div>
          )}

          {data.hobbies.length>0 && (
            <div>
              <div className="t1-sec-title">Interests</div>
              <div style={{fontSize:10.5,color:"#888"}}>{data.hobbies.join(" · ")}</div>
            </div>
          )}
        </div>

        <div className="t1-right">
          {data.experience.length>0 && (
            <div>
              <div className="t1-sec-title">Experience</div>
              {data.experience.map(x=>(
                <div key={x.id} className="t1-exp-item">
                  <div className="t1-exp-head">
                    <span className="t1-exp-title">{x.jobTitle}</span>
                    <span className="t1-exp-dur">{x.duration}</span>
                  </div>
                  <div className="t1-exp-co">{x.company}</div>
                  <div className="t1-exp-desc">{x.responsibilities}</div>
                </div>
              ))}
            </div>
          )}

          {data.projects.length>0 && (
            <div>
              <div className="t1-sec-title">Projects</div>
              {data.projects.map(p=>(
                <div key={p.id} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#111"}}>{p.name}</div>
                  <div style={{margin:"3px 0"}}>{p.technologies.map(t=><span key={t} className="t1-chip">{t}</span>)}</div>
                  <div className="t1-exp-desc">{p.description}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications.filter(Boolean).length>0 && (
            <div>
              <div className="t1-sec-title">Certifications</div>
              {data.certifications.filter(Boolean).map((c,i)=><div key={i} className="t1-dot-item">{c}</div>)}
            </div>
          )}

          {data.achievements.filter(Boolean).length>0 && (
            <div>
              <div className="t1-sec-title">Achievements</div>
              {data.achievements.filter(Boolean).map((a,i)=><div key={i} className="t1-dot-item">{a}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TEMPLATE 2 — Creative Executive
════════════════════════════════════════ */
function T2({ data }) {
  return (
    <div className="t2">
      <div className="t2-sidebar">
        <div className="t2-photo-wrap">
          {data.photo
            ? <img src={data.photo} alt="" className="t2-photo"/>
            : <div className="t2-photo-ph"><Ic n="user" size={30} color="rgba(255,255,255,0.3)"/></div>}
          <div className="t2-name">{data.name||"Your Name"}</div>
        </div>

        {(data.email||data.phone||data.linkedin||data.github) && (
          <div>
            <div className="t2-s-title">Contact</div>
            {data.email    && <div className="t2-contact-item"><Ic n="mail"     size={9} color="rgba(255,255,255,0.35)"/><span>{data.email}</span></div>}
            {data.phone    && <div className="t2-contact-item"><Ic n="phone"    size={9} color="rgba(255,255,255,0.35)"/><span>{data.phone}</span></div>}
            {data.linkedin && <div className="t2-contact-item"><Ic n="linkedin" size={9} color="rgba(255,255,255,0.35)"/><span>{data.linkedin}</span></div>}
            {data.github   && <div className="t2-contact-item"><Ic n="github"   size={9} color="rgba(255,255,255,0.35)"/><span>{data.github}</span></div>}
          </div>
        )}

        {data.skills.technical.length>0 && (
          <div>
            <div className="t2-s-title">Technical</div>
            {data.skills.technical.map(s=><span key={s} className="t2-sk-chip">{s}</span>)}
          </div>
        )}
        {data.skills.languages.length>0 && (
          <div>
            <div className="t2-s-title">Languages</div>
            {data.skills.languages.map(s=><span key={s} className="t2-sk-chip">{s}</span>)}
          </div>
        )}
        {data.languagesKnown.length>0 && (
          <div>
            <div className="t2-s-title">Spoken</div>
            {data.languagesKnown.map(l=><div key={l} style={{fontSize:9.5,color:"rgba(255,255,255,0.7)",marginBottom:3}}>{l}</div>)}
          </div>
        )}
        {data.hobbies.length>0 && (
          <div>
            <div className="t2-s-title">Interests</div>
            {data.hobbies.map(h=><div key={h} style={{fontSize:9.5,color:"rgba(255,255,255,0.55)",marginBottom:2}}>· {h}</div>)}
          </div>
        )}
      </div>

      <div className="t2-main">
        {data.objective && <p className="t2-objective">{data.objective}</p>}

        {data.experience.length>0 && (
          <div>
            <div className="t2-sec-title">Professional Experience</div>
            {data.experience.map(x=>(
              <div key={x.id} className="t2-exp-item">
                <div className="t2-exp-head">
                  <span className="t2-exp-title">{x.jobTitle}</span>
                  <span className="t2-exp-dur">{x.duration}</span>
                </div>
                <div className="t2-exp-co">{x.company}</div>
                <div className="t2-exp-desc">{x.responsibilities}</div>
              </div>
            ))}
          </div>
        )}

        {data.education.length>0 && (
          <div>
            <div className="t2-sec-title">Education</div>
            {data.education.map(e=>(
              <div key={e.id} className="t2-edu-item">
                {e.type==="college"
                  ? <><div className="t2-edu-deg">{e.degreeName}</div><div className="t2-edu-co">{e.college}</div><div className="t2-edu-meta">{e.yearOfStudy} · CGPA: {e.cgpa}</div></>
                  : <><div className="t2-edu-deg">{e.schoolName}</div><div className="t2-edu-meta">X: {e.class10}% &nbsp;|&nbsp; XII: {e.class12}% &nbsp;|&nbsp; {e.passoutYear}</div></>
                }
              </div>
            ))}
          </div>
        )}

        {data.projects.length>0 && (
          <div>
            <div className="t2-sec-title">Projects</div>
            {data.projects.map(p=>(
              <div key={p.id} style={{marginBottom:12}}>
                <div className="t2-exp-title">{p.name}</div>
                <div style={{margin:"3px 0"}}>{p.technologies.map(t=><span key={t} className="t2-proj-chip">{t}</span>)}</div>
                <div className="t2-exp-desc">{p.description}</div>
              </div>
            ))}
          </div>
        )}

        <div className="t2-two-col">
          {data.certifications.filter(Boolean).length>0 && (
            <div>
              <div className="t2-sec-title">Certifications</div>
              {data.certifications.filter(Boolean).map((c,i)=>(
                <div key={i} className="t2-check-item"><Ic n="check" size={10} color="#1b2a4a"/>{c}</div>
              ))}
            </div>
          )}
          {data.achievements.filter(Boolean).length>0 && (
            <div>
              <div className="t2-sec-title">Achievements</div>
              {data.achievements.filter(Boolean).map((a,i)=>(
                <div key={i} className="t2-check-item"><Ic n="award" size={10} color="#1b2a4a"/>{a}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TEMPLATE 3 — Tech / Developer Sleek
════════════════════════════════════════ */
function T3({ data }) {
  return (
    <div className="t3">
      <div className="t3-head">
        <div>
          <div className="t3-path">~/dev/portfolio</div>
          <div className="t3-name">{data.name||"Your Name"}</div>
          <div className="t3-contacts">
            {data.email    && <span className="em">{data.email}</span>}
            {data.phone    && <span>{data.phone}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
            {data.github   && <span>{data.github}</span>}
          </div>
        </div>
        {data.photo
          ? <img src={data.photo} alt="" className="t3-photo"/>
          : <div className="t3-photo-ph"><Ic n="code" size={22} color="#00d4aa"/></div>}
      </div>

      {data.objective && (
        <div className="t3-obj">
          <span className="t3-obj-label">// objective</span>
          {data.objective}
        </div>
      )}

      <div className="t3-cols">
        <div className="t3-left">
          {(data.skills.languages.length>0||data.skills.technical.length>0) && (
            <div>
              <div className="t3-cmd">$ skills --list</div>
              {data.skills.languages.length>0 && (
                <div style={{marginBottom:7}}>
                  <div className="t3-sub-label">languages:</div>
                  {data.skills.languages.map(s=><span key={s} className="t3-green">{s}</span>)}
                </div>
              )}
              {data.skills.technical.length>0 && (
                <div>
                  <div className="t3-sub-label">tech_stack:</div>
                  {data.skills.technical.map(s=><span key={s} className="t3-gray">{s}</span>)}
                </div>
              )}
            </div>
          )}

          {data.education.length>0 && (
            <div>
              <div className="t3-cmd">$ education --all</div>
              {data.education.map(e=>(
                <div key={e.id} className="t3-card">
                  {e.type==="college"
                    ? <><div className="t3-card-title">{e.degreeName}</div><div className="t3-card-acc">{e.college}</div><div className="t3-card-sub">{e.yearOfStudy} · CGPA: {e.cgpa}</div></>
                    : <><div className="t3-card-title">{e.schoolName}</div><div className="t3-card-sub">X:{e.class10}% XII:{e.class12}% ({e.passoutYear})</div></>
                  }
                </div>
              ))}
            </div>
          )}

          {data.languagesKnown.length>0 && (
            <div>
              <div className="t3-cmd">$ lang --spoken</div>
              <div className="t3-spoken">
                {data.languagesKnown.map((l,i)=>(
                  <span key={l}>{l}{i<data.languagesKnown.length-1&&<span className="t3-sep">·</span>}</span>
                ))}
              </div>
            </div>
          )}

          {data.hobbies.length>0 && (
            <div>
              <div className="t3-cmd">$ interests</div>
              {data.hobbies.map(h=><div key={h} className="t3-hobby">· {h}</div>)}
            </div>
          )}
        </div>

        <div className="t3-right">
          {data.experience.length>0 && (
            <div>
              <div className="t3-cmd">$ git log --experience</div>
              {data.experience.map(x=>(
                <div key={x.id} className="t3-card">
                  <div className="t3-card-row">
                    <div className="t3-card-title">{x.jobTitle}</div>
                    <span className="t3-card-dur">{x.duration}</span>
                  </div>
                  <div className="t3-card-acc">{x.company}</div>
                  <div className="t3-card-desc">{x.responsibilities}</div>
                </div>
              ))}
            </div>
          )}

          {data.projects.length>0 && (
            <div>
              <div className="t3-cmd">$ ls ~/projects</div>
              {data.projects.map(p=>(
                <div key={p.id} className="t3-card">
                  <div className="t3-card-title">{p.name}</div>
                  <div style={{margin:"3px 0"}}>{p.technologies.map(t=><span key={t} className="t3-green">{t}</span>)}</div>
                  <div className="t3-card-desc">{p.description}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications.filter(Boolean).length>0 && (
            <div>
              <div className="t3-cmd">$ verify --certs</div>
              {data.certifications.filter(Boolean).map((c,i)=>(
                <div key={i} className="t3-list-item"><span className="t3-check">✓</span>{c}</div>
              ))}
            </div>
          )}

          {data.achievements.filter(Boolean).length>0 && (
            <div>
              <div className="t3-cmd">$ trophy --list</div>
              {data.achievements.filter(Boolean).map((a,i)=>(
                <div key={i} className="t3-list-item"><span className="t3-star">★</span>{a}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TEMPLATE 4 — Editorial / Elegant
════════════════════════════════════════ */
function T4({ data }) {
  const contacts = [data.email, data.phone, data.linkedin, data.github].filter(Boolean);
  return (
    <div className="t4">
      <div className="t4-masthead">
        {data.photo
          ? <img src={data.photo} alt="" className="t4-photo"/>
          : <div className="t4-photo-ph"><Ic n="user" size={34} color="#b8860b"/></div>}
        <div className="t4-name">{data.name||"Your Name"}</div>
        <div className="t4-contacts">
          {contacts.map((v,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
              {v}{i<contacts.length-1&&<span className="t4-sep">◆</span>}
            </span>
          ))}
        </div>
      </div>

      {data.objective && <p className="t4-obj">{data.objective}</p>}

      <div className="t4-cols">
        <div className="t4-left">
          {data.education.length>0 && (
            <div>
              <div className="t4-sec-title">Education</div>
              {data.education.map(e=>(
                <div key={e.id} className="t4-edu-item">
                  {e.type==="college"
                    ? <><div className="t4-edu-deg">{e.degreeName}</div><div className="t4-edu-inst">{e.college}</div><div className="t4-edu-meta">{e.yearOfStudy} · {e.cgpa} CGPA</div></>
                    : <><div className="t4-edu-deg">{e.schoolName}</div><div className="t4-edu-meta">X: {e.class10}% · XII: {e.class12}%</div><div className="t4-edu-meta">Passed {e.passoutYear}</div></>
                  }
                </div>
              ))}
            </div>
          )}

          {(data.skills.technical.length>0||data.skills.languages.length>0) && (
            <div>
              <div className="t4-sec-title">Expertise</div>
              {data.skills.technical.length>0 && (
                <div className="t4-skill-group">
                  <div className="t4-skill-label">Technical</div>
                  {data.skills.technical.map(s=><span key={s} className="t4-chip">{s}</span>)}
                </div>
              )}
              {data.skills.languages.length>0 && (
                <div className="t4-skill-group">
                  <div className="t4-skill-label">Languages</div>
                  {data.skills.languages.map(s=><span key={s} className="t4-chip">{s}</span>)}
                </div>
              )}
            </div>
          )}

          {data.certifications.filter(Boolean).length>0 && (
            <div>
              <div className="t4-sec-title">Credentials</div>
              {data.certifications.filter(Boolean).map((c,i)=><div key={i} className="t4-bullet">— {c}</div>)}
            </div>
          )}

          {data.languagesKnown.length>0 && (
            <div>
              <div className="t4-sec-title">Languages</div>
              <div className="t4-simple">{data.languagesKnown.join(" · ")}</div>
            </div>
          )}

          {data.hobbies.length>0 && (
            <div>
              <div className="t4-sec-title">Interests</div>
              <div className="t4-simple" style={{fontSize:11,color:"#888"}}>{data.hobbies.join(" · ")}</div>
            </div>
          )}
        </div>

        <div className="t4-right">
          {data.experience.length>0 && (
            <div>
              <div className="t4-sec-title">Professional Record</div>
              {data.experience.map(x=>(
                <div key={x.id} className="t4-exp-item">
                  <div className="t4-exp-head">
                    <span className="t4-exp-title">{x.jobTitle}</span>
                    <span className="t4-exp-dur">{x.duration}</span>
                  </div>
                  <div className="t4-exp-co">{x.company}</div>
                  <div className="t4-exp-desc">{x.responsibilities}</div>
                </div>
              ))}
            </div>
          )}

          {data.projects.length>0 && (
            <div>
              <div className="t4-sec-title">Selected Works</div>
              {data.projects.map(p=>(
                <div key={p.id} className="t4-exp-item">
                  <div className="t4-exp-title">{p.name}</div>
                  <div className="t4-proj-tech">{p.technologies.join(" · ")}</div>
                  <div className="t4-exp-desc">{p.description}</div>
                </div>
              ))}
            </div>
          )}

          {data.achievements.filter(Boolean).length>0 && (
            <div>
              <div className="t4-sec-title">Honours</div>
              {data.achievements.filter(Boolean).map((a,i)=><div key={i} className="t4-bullet">◆ {a}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TEMPLATE LIST
════════════════════════════════════════ */
const TEMPLATES = [
  { id:1, label:"Minimalist", icon:"layout",    Comp:T1 },
  { id:2, label:"Executive",  icon:"briefcase", Comp:T2 },
  { id:3, label:"Developer",  icon:"code",      Comp:T3 },
  { id:4, label:"Editorial",  icon:"book",      Comp:T4 },
];

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
function App() {
  const [theme,    setTheme]    = useState("dark");
  const [tmpl,     setTmpl]     = useState(1);
  const [data,     setData]     = useState(SAMPLE);
  const [loading,  setLoading]  = useState(false);
  const paperRef = useRef(null);

  /* Apply theme attribute */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* Setters */
  const set      = k => v => setData(d => ({...d, [k]:v}));
  const setSkill = k => v => setData(d => ({...d, skills:{...d.skills,[k]:v}}));

  const addEdu = type => setData(d => ({...d, education:[...d.education,
    type==="school"
      ? {id:uid(),type:"school",schoolName:"",class10:"",class12:"",passoutYear:""}
      : {id:uid(),type:"college",degreeName:"",college:"",yearOfStudy:"",cgpa:""}
  ]}));
  const updEdu = (id,f,v) => setData(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const remEdu = id        => setData(d=>({...d,education:d.education.filter(e=>e.id!==id)}));

  const addProj = ()       => setData(d=>({...d,projects:[...d.projects,{id:uid(),name:"",technologies:[],description:""}]}));
  const updProj = (id,f,v) => setData(d=>({...d,projects:d.projects.map(p=>p.id===id?{...p,[f]:v}:p)}));
  const remProj = id       => setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));

  const addExp  = ()       => setData(d=>({...d,experience:[...d.experience,{id:uid(),jobTitle:"",company:"",duration:"",responsibilities:""}]}));
  const updExp  = (id,f,v) => setData(d=>({...d,experience:d.experience.map(x=>x.id===id?{...x,[f]:v}:x)}));
  const remExp  = id       => setData(d=>({...d,experience:d.experience.filter(x=>x.id!==id)}));

  const onPhoto = e => {
    const file = e.target.files?.[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ev => set("photo")(ev.target.result);
    r.readAsDataURL(file);
  };

  const exportPDF = useCallback(async () => {
    if(!paperRef.current || loading) return;
    setLoading(true);
    try {
      if(!window.html2pdf) {
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          s.onload=res; s.onerror=rej;
          document.head.appendChild(s);
        });
      }
      await window.html2pdf().set({
        margin:0,
        filename:`${data.name||"CV"}.pdf`,
        image:{type:"jpeg",quality:0.98},
        html2canvas:{scale:2,useCORS:true,allowTaint:true,scrollX:0,scrollY:0},
        jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},
        pagebreak:{mode:["avoid-all","css"]},
      }).from(paperRef.current).save();
    } catch(err){ console.error(err); }
    finally { setLoading(false); }
  }, [data.name, loading]);

  const { Comp: CVComp } = TEMPLATES.find(t=>t.id===tmpl);

  return (
    <>
      {/* ── TOP BAR ── */}
      <div id="topbar">
        <div className="brand">
          <div className="brand-logo"><Ic n="file" size={14} color="#fff"/></div>
          <span className="brand-name">CVForge</span>
          <span className="badge">Pro</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-icon"
            onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
            title="Toggle theme">
            <Ic n={theme==="dark"?"sun":"moon"} size={15}
              color={theme==="dark"?"#fbbf24":"#6366f1"}/>
          </button>
          <button className="btn btn-acc" onClick={exportPDF} disabled={loading}>
            <Ic n="download" size={13} color="#fff"/>
            {loading ? "Generating…" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div id="main">

        {/* ── FORM PANEL ── */}
        <div id="form-panel">

          {/* Personal Info */}
          <Accordion iconName="user" title="Personal Info" defaultOpen={true}>
            <div className="photo-row">
              <div className="photo-thumb">
                {data.photo
                  ? <img src={data.photo} alt=""/>
                  : <Ic n="camera" size={18} color="var(--t3)"/>}
              </div>
              <div className="photo-col">
                <span className="photo-label">Profile Photo</span>
                <label style={{cursor:"pointer"}}>
                  <div className="btn btn-outline btn-sm" style={{display:"inline-flex",pointerEvents:"none"}}>
                    <Ic n="camera" size={11} color="var(--acc)"/> Upload Image
                  </div>
                  <input type="file" accept="image/*" style={{display:"none"}} onChange={onPhoto}/>
                </label>
              </div>
              {data.photo && (
                <button className="btn btn-danger btn-icon btn-sm" onClick={()=>set("photo")(null)}>
                  <Ic n="x" size={12}/>
                </button>
              )}
            </div>
            <Field label="Full Name"   value={data.name}     onChange={set("name")}     placeholder="Aryan Mehta"/>
            <Field label="Email"       value={data.email}    onChange={set("email")}    placeholder="aryan@example.com"/>
            <Field label="Phone"       value={data.phone}    onChange={set("phone")}    placeholder="+91 98765 43210"/>
            <Field label="LinkedIn"    value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..."/>
            <Field label="GitHub"      value={data.github}   onChange={set("github")}   placeholder="github.com/..."/>
          </Accordion>

          {/* Objective */}
          <Accordion iconName="file" title="Objective">
            <Area value={data.objective} onChange={set("objective")} rows={4}/>
          </Accordion>

          {/* Education */}
          <Accordion iconName="graduation" title="Education">
            {data.education.map(e=>(
              <div key={e.id} className="entry-card">
                <div className="entry-card-header">
                  <span className="entry-badge">{e.type==="college"?"College / University":"School"}</span>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>remEdu(e.id)}>
                    <Ic n="trash" size={11}/>
                  </button>
                </div>
                {e.type==="college" ? (
                  <>
                    <Field value={e.degreeName}  onChange={v=>updEdu(e.id,"degreeName",v)}  placeholder="B.Tech Computer Science"/>
                    <Field value={e.college}     onChange={v=>updEdu(e.id,"college",v)}     placeholder="IIT Bombay"/>
                    <div className="field-row">
                      <Field value={e.yearOfStudy} onChange={v=>updEdu(e.id,"yearOfStudy",v)} placeholder="2020 – 2024"/>
                      <Field value={e.cgpa}        onChange={v=>updEdu(e.id,"cgpa",v)}        placeholder="CGPA"/>
                    </div>
                  </>
                ) : (
                  <>
                    <Field value={e.schoolName}  onChange={v=>updEdu(e.id,"schoolName",v)}  placeholder="School Name"/>
                    <div className="field-row">
                      <Field value={e.class10}   onChange={v=>updEdu(e.id,"class10",v)}     placeholder="Class X %"/>
                      <Field value={e.class12}   onChange={v=>updEdu(e.id,"class12",v)}     placeholder="Class XII %"/>
                    </div>
                    <Field value={e.passoutYear} onChange={v=>updEdu(e.id,"passoutYear",v)} placeholder="Passout Year"/>
                  </>
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-outline btn-sm" onClick={()=>addEdu("school")}>
                <Ic n="plus" size={11} color="var(--acc)"/> School
              </button>
              <button className="btn btn-outline btn-sm" onClick={()=>addEdu("college")}>
                <Ic n="plus" size={11} color="var(--acc)"/> College
              </button>
            </div>
          </Accordion>

          {/* Skills */}
          <Accordion iconName="code" title="Skills">
            <TagInput label="Technical Skills"      tags={data.skills.technical} onChange={setSkill("technical")} placeholder="e.g. React.js"/>
            <TagInput label="Programming Languages" tags={data.skills.languages} onChange={setSkill("languages")} placeholder="e.g. Python"/>
          </Accordion>

          {/* Projects */}
          <Accordion iconName="layers" title="Projects">
            {data.projects.map(p=>(
              <div key={p.id} className="entry-card">
                <div className="entry-card-header">
                  <span className="entry-badge">Project</span>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>remProj(p.id)}>
                    <Ic n="trash" size={11}/>
                  </button>
                </div>
                <Field value={p.name}        onChange={v=>updProj(p.id,"name",v)}        placeholder="Project Name"/>
                <TagInput tags={p.technologies} onChange={v=>updProj(p.id,"technologies",v)} placeholder="Tech (Enter to add)"/>
                <Area  value={p.description} onChange={v=>updProj(p.id,"description",v)} rows={2}/>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" style={{alignSelf:"flex-start"}} onClick={addProj}>
              <Ic n="plus" size={11} color="var(--acc)"/> Add Project
            </button>
          </Accordion>

          {/* Experience */}
          <Accordion iconName="briefcase" title="Experience / Internships">
            {data.experience.map(x=>(
              <div key={x.id} className="entry-card">
                <div className="entry-card-header">
                  <span className="entry-badge">Role</span>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>remExp(x.id)}>
                    <Ic n="trash" size={11}/>
                  </button>
                </div>
                <Field value={x.jobTitle}        onChange={v=>updExp(x.id,"jobTitle",v)}        placeholder="Job Title"/>
                <Field value={x.company}         onChange={v=>updExp(x.id,"company",v)}         placeholder="Company Name"/>
                <Field value={x.duration}        onChange={v=>updExp(x.id,"duration",v)}        placeholder="June 2023 – Aug 2023"/>
                <Area  value={x.responsibilities}onChange={v=>updExp(x.id,"responsibilities",v)} rows={3}/>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" style={{alignSelf:"flex-start"}} onClick={addExp}>
              <Ic n="plus" size={11} color="var(--acc)"/> Add Experience
            </button>
          </Accordion>

          {/* Certifications */}
          <Accordion iconName="award" title="Certifications">
            <ListInput items={data.certifications} onChange={set("certifications")} placeholder="Certification name…"/>
          </Accordion>

          {/* Achievements */}
          <Accordion iconName="zap" title="Achievements">
            <ListInput items={data.achievements} onChange={set("achievements")} placeholder="Achievement…"/>
          </Accordion>

          {/* Languages & Hobbies */}
          <Accordion iconName="globe" title="Languages & Hobbies">
            <TagInput label="Languages Known"   tags={data.languagesKnown} onChange={set("languagesKnown")} placeholder="English"/>
            <TagInput label="Hobbies & Interests" tags={data.hobbies}      onChange={set("hobbies")}        placeholder="Chess"/>
          </Accordion>

        </div>{/* /form-panel */}

        {/* ── PREVIEW PANEL ── */}
        <div id="preview-panel">

          {/* Template selector */}
          <div id="tmpl-bar">
            <Ic n="eye" size={13} color="var(--t3)"/>
            <span style={{fontSize:11.5,color:"var(--t2)",fontWeight:500,marginRight:4,whiteSpace:"nowrap"}}>Template:</span>
            {TEMPLATES.map(t=>(
              <button key={t.id}
                className={`tmpl-btn${tmpl===t.id?" active":""}`}
                onClick={()=>setTmpl(t.id)}>
                <Ic n={t.icon} size={11} color={tmpl===t.id?"#fff":"var(--t2)"}/>
                {t.label}
              </button>
            ))}
          </div>

          {/* CV paper */}
          <div id="preview-scroll">
            <div ref={paperRef} className="cv-paper">
              <CVComp data={data}/>
            </div>
          </div>

        </div>{/* /preview-panel */}
      </div>{/* /main */}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
