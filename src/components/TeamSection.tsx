/**
 * TeamSection – About/Team section with placeholder cards and Privacy Statement.
 */

const teamMembers = [
  { id: 'tm-1', name: 'Dr. Sarah Chen',    role: 'Chief Pathologist & AI Lead', specialty: 'Breast Cancer Histopathology', initials: 'SC', bg: 'linear-gradient(135deg, #44c5cb, #1e6f79)' },
  { id: 'tm-2', name: 'Dr. James Okonkwo', role: 'Deep Learning Researcher',    specialty: 'Computational Pathology',      initials: 'JO', bg: 'linear-gradient(135deg, #4a6fc2, #1c2348)' },
  { id: 'tm-3', name: 'Dr. Aisha Patel',   role: 'Clinical Validation Lead',    specialty: 'Oncology & XAI Systems',       initials: 'AP', bg: 'linear-gradient(135deg, #8b5cf6, #5b21b6)' },
  { id: 'tm-4', name: 'Prof. Marcus Weber', role: 'Medical Ethics Advisor',      specialty: 'AI in Clinical Practice',      initials: 'MW', bg: 'linear-gradient(135deg, #10b981, #0f7d68)' },
];

const privacyPoints = [
  { icon: '🔒', title: 'Zero Data Retention', description: 'Images are processed in real-time and immediately discarded. We store no patient data whatsoever.' },
  { icon: '🛡️', title: 'End-to-End Encryption', description: 'All image transmissions are encrypted via TLS 1.3. Your data never travels in plaintext.' },
  { icon: '⚕️', title: 'HIPAA Framework Compliance', description: 'Our architecture is designed following HIPAA guidelines for Protected Health Information (PHI).' },
  { icon: '🌐', title: 'No Third-Party Sharing', description: 'Patient images are never shared with, sold to, or accessible by any third parties.' },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-28 relative overflow-hidden" style={{ background: 'var(--color-surface-900)' }}>
      <div className="section-container relative z-10">
        {/* Team header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(41,168,177,0.1)', border: '1px solid rgba(41,168,177,0.2)', color: '#44c5cb' }}
          >
            Meet the Team
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Built by <span className="gradient-text">Experts</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-surface-400)' }}>
            A multidisciplinary team of pathologists, ML researchers, and clinical ethicists
            dedicated to responsible AI in oncology.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {teamMembers.map((member, idx) => (
            <div
              key={member.id}
              id={member.id}
              className="glass-card p-6 text-center hover-lift group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300"
                style={{ background: member.bg, boxShadow: 'var(--shadow-glass)' }}
              >
                {member.initials}
              </div>
              <h3 className="text-base font-bold text-white mb-1">{member.name}</h3>
              <p className="text-sm font-semibold mb-2" style={{ color: '#44c5cb' }}>{member.role}</p>
              <p className="text-xs" style={{ color: 'var(--color-surface-500)' }}>{member.specialty}</p>
            </div>
          ))}
        </div>

        {/* Privacy statement */}
        <div
          className="glass-card p-8 md:p-12"
          style={{ border: '1px solid rgba(30,111,121,0.2)' }}
        >
          <div className="text-center mb-10">
            <span className="text-3xl mb-3 block">🔐</span>
            <h2 className="text-3xl font-bold text-white mb-3">Patient Data Privacy Commitment</h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'var(--color-surface-400)' }}>
              At OncoVision, we treat patient privacy as a clinical imperative, not a legal checkbox.
              Here is our unconditional commitment to your data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {privacyPoints.map((point) => (
              <div
                key={point.title}
                className="glass-card-light p-5 flex gap-4"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{point.icon}</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">{point.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-surface-400)' }}>{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ethics quote */}
          <div
            className="text-center p-6 rounded-xl"
            style={{
              background: 'linear-gradient(to right, rgba(11,48,57,0.3), rgba(30,111,121,0.2), rgba(11,48,57,0.3))',
              border: '1px solid rgba(30,111,121,0.3)',
            }}
          >
            <p className="text-lg font-semibold italic leading-relaxed max-w-3xl mx-auto" style={{ color: '#79dce0' }}>
              "Every analysis performed on OncoVision is ephemeral by design.
              We believe that the right to medical privacy is fundamental, and
              no clinical tool should compromise it."
            </p>
            <p className="text-sm mt-3" style={{ color: 'var(--color-surface-500)' }}>
              — OncoVision Ethics &amp; Privacy Board
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
