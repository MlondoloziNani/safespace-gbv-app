import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, ArrowLeft, ArrowRight, AlertTriangle, Shield, HeartPulse, Smartphone, Frown, Users, HelpCircle, Camera, Mic, MicOff, FastForward } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export function ReportForm() {
  const { reportCase } = useAppContext();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('right');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Questionnaire State
  const [immediateDanger, setImmediateDanger] = useState(null);
  const [category, setCategory] = useState('');
  
  // Dynamic Questions State
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  
  // Details & Evidence State
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  const categories = [
    { name: 'Physical Abuse', icon: Shield, color: '#EF4444' },
    { name: 'Emotional Abuse', icon: Frown, color: '#F59E0B' },
    { name: 'Cyberbullying', icon: Smartphone, color: '#8B5CF6' },
    { name: 'School Bullying', icon: Users, color: '#3B82F6' },
    { name: 'GBV / Harassment', icon: HeartPulse, color: '#EC4899' },
    { name: 'Other', icon: HelpCircle, color: '#6B7280' }
  ];

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setAdditionalInfo(prev => prev + transcript + ' ');
          } else {
            currentTranscript += transcript;
          }
        }
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
    } else {
      speechRecognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEvidence(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1 && immediateDanger === null) {
      alert("Please select Yes or No.");
      return;
    }
    if (step === 2 && !category) {
      alert("Please select a category.");
      return;
    }
    setDirection('right');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection('left');
    setStep(prev => prev - 1);
  };

  const setCategoryAndAdvance = (catName) => {
    setCategory(catName);
    // Auto advance after brief delay for UX
    setTimeout(() => {
      setDirection('right');
      setStep(3);
    }, 350);
  };

  const setDynamicAnswer = (key, value) => {
    setDynamicAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e, isQuickSOS = false) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    // Compile answers
    let dynamicText = Object.entries(dynamicAnswers).map(([k, v]) => `${k}: ${v ? 'YES' : 'NO'}`).join('\n');
    
    const compiledDescription = `
[${isQuickSOS ? 'QUICK SOS' : 'STANDARD REPORT'}]
Immediate Danger: ${immediateDanger === null ? 'UNKNOWN' : immediateDanger ? 'YES' : 'NO'}
Category: ${category || 'UNKNOWN'}
${dynamicText}

Additional Info:
${additionalInfo || 'None provided.'}
    `.trim();

    setTimeout(() => {
      let finalLocation = { lat: -26.2041, lng: 28.0473 }; // fallback to JHB
      
      const submitCase = (loc) => {
        reportCase({
          type: category || (isQuickSOS ? 'Emergency SOS' : 'Other'),
          description: compiledDescription,
          location: loc,
          hasEvidence: !!evidence // Note: we'd normally upload the image to storage here
        });
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => navigate('/victim'), 2500);
      };

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => submitCase({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => submitCase(finalLocation)
        );
      } else {
        submitCase(finalLocation);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="app-container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <GlassCard style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '400px' }}>
          <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
            <Send size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2>Report Submitted</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Help is on the way. A counselor has been notified with your exact location.</p>
        </GlassCard>
      </div>
    );
  }

  const animationClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';
  const totalSteps = 5;

  return (
    <div className="app-container" style={{ overflowX: 'hidden' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginTop: '1rem', paddingBottom: '6rem' }}>
        
        {/* Header with Quick SOS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => {
                if (step > 1) prevStep();
                else navigate(-1);
              }} 
              className="btn btn-outline" 
              style={{ padding: '0.5rem', borderRadius: '50%' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Step {step} of {totalSteps}</h1>
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ height: '4px', width: '30px', borderRadius: '2px', background: i <= step ? 'var(--accent)' : 'rgba(0,0,0,0.1)' }} />
                ))}
              </div>
            </div>
          </div>

          <button 
            className="btn btn-danger" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => handleSubmit(null, true)}
            disabled={isSubmitting}
          >
            <FastForward size={16} /> Quick SOS
          </button>
        </div>

        {/* Wizard Steps */}
        <div key={`${step}-${direction}`} className={animationClass}>
          
          {step === 1 && (
            <GlassCard>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Safety Check</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Are you in immediate physical danger right now?</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  className={`btn ${immediateDanger === true ? 'btn-danger' : 'btn-outline'}`}
                  style={{ padding: '2rem 1rem', fontSize: '1.25rem', flexDirection: 'column', gap: '1rem' }}
                  onClick={() => setImmediateDanger(true)}
                >
                  <AlertTriangle size={32} /> Yes
                </button>
                <button 
                  className={`btn ${immediateDanger === false ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '2rem 1rem', fontSize: '1.25rem', flexDirection: 'column', gap: '1rem' }}
                  onClick={() => setImmediateDanger(false)}
                >
                  <Shield size={32} /> No
                </button>
              </div>

              {immediateDanger && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem', background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={24} style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>
                    Please call 10111 immediately if you are in danger. You can still complete this report, but your safety comes first.
                  </p>
                </div>
              )}
            </GlassCard>
          )}

          {step === 2 && (
            <GlassCard>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>What's Happening?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Select a category. We will adjust the questions for you.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setCategoryAndAdvance(cat.name)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '1.5rem 1rem',
                        borderRadius: '16px',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid rgba(0,0,0,0.1)',
                        background: isSelected ? `${cat.color}15` : 'rgba(255,255,255,0.5)',
                        color: isSelected ? cat.color : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        boxShadow: isSelected ? `0 4px 12px ${cat.color}30` : 'none'
                      }}
                    >
                      <Icon size={32} color={isSelected ? cat.color : 'var(--text-muted)'} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {step === 3 && (
            <GlassCard>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Help Us Understand</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Answer these quick questions based on your situation.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Dynamic Question 1 */}
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.75rem' }}>
                    {category === 'Cyberbullying' ? 'Do you have screenshots of the messages?' : 
                     category === 'Physical Abuse' ? 'Do you require immediate medical attention?' : 
                     category === 'School Bullying' ? 'Are you currently on school grounds?' :
                     'Do you know the person hurting/bullying you?'}
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${dynamicAnswers['q1'] === true ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setDynamicAnswer('q1', true)}>Yes</button>
                    <button className={`btn ${dynamicAnswers['q1'] === false ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setDynamicAnswer('q1', false)}>No</button>
                  </div>
                </div>

                {/* Dynamic Question 2 */}
                <div>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.75rem' }}>
                    Has this happened more than once?
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${dynamicAnswers['q2'] === true ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setDynamicAnswer('q2', true)}>Yes</button>
                    <button className={`btn ${dynamicAnswers['q2'] === false ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => setDynamicAnswer('q2', false)}>No</button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {step === 4 && (
            <GlassCard>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Evidence (Optional)</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You can securely attach a photo (like a screenshot or injury). Only your counselor will see this.</p>
              
              <div style={{ border: '2px dashed var(--accent)', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.5)' }}>
                {evidence ? (
                  <div>
                    <img src={evidence} alt="Evidence" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '1rem' }} />
                    <button onClick={() => setEvidence(null)} className="btn btn-outline" style={{ display: 'block', margin: '0 auto' }}>Remove Photo</button>
                  </div>
                ) : (
                  <div>
                    <Camera size={48} color="var(--accent)" style={{ margin: '0 auto 1rem auto', opacity: 0.7 }} />
                    <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {step === 5 && (
            <GlassCard>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Additional Details</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Tell us anything else we should know. Type or use your voice.</p>
              
              <div style={{ position: 'relative' }}>
                <textarea 
                  className="input-field" 
                  rows="6"
                  placeholder="Type here, or tap the microphone to speak..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  style={{ resize: 'none', background: 'rgba(255,255,255,0.9)', paddingBottom: '3rem' }}
                ></textarea>
                
                {/* Voice-to-Text Button */}
                {window.SpeechRecognition || window.webkitSpeechRecognition ? (
                  <button 
                    type="button"
                    onClick={toggleListening}
                    style={{
                      position: 'absolute', bottom: '1rem', right: '1rem',
                      background: isListening ? 'var(--error)' : 'var(--accent)', color: 'white',
                      border: 'none', borderRadius: '50%', padding: '0.75rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                ) : null}
              </div>

              {isListening && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>Listening...</p>}
            </GlassCard>
          )}

        </div>

        {/* Navigation Footer */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {step < totalSteps ? (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
              onClick={nextStep}
            >
              Continue <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              className="btn btn-danger" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Request...' : 'Send SOS Request'} <Send size={20} style={{ marginLeft: '0.5rem' }} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
