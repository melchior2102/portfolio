import { useEffect, useMemo, useState } from 'react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import {
  about,
  education,
  experience,
  hero,
  identity,
  interests,
  projectCategories,
  projects,
  skills,
} from './data';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.04 },
  },
};

function Reveal({ children, className = '', delay = 0, amount = 0.18, ...props }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`section-shell ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ label, title }) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
    </Reveal>
  );
}

function ProjectArtwork({ visual }) {
  const artwork = {
    'oral-health': {
      icon: <Heart size={37} strokeWidth={1.25} />,
      label: 'Community care',
      className: 'artwork-oral',
    },
    campus: {
      icon: <Camera size={37} strokeWidth={1.25} />,
      label: 'Life in frames',
      className: 'artwork-campus',
    },
    periodontal: {
      icon: <Stethoscope size={37} strokeWidth={1.25} />,
      label: 'Periodontal health',
      className: 'artwork-periodontal',
    },
    'dental-photo': {
      icon: <ImageIcon size={39} strokeWidth={1.25} />,
      label: 'Dental photography',
      className: 'artwork-dental-photo',
    },
  }[visual];

  return (
    <div className={`project-artwork ${artwork.className}`}>
      <span className="artwork-orbit artwork-orbit-one" />
      <span className="artwork-orbit artwork-orbit-two" />
      <div className="artwork-symbol">{artwork.icon}</div>
      <span className="artwork-label">{artwork.label}</span>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.34, ease: 'easeOut' }}
      className="project-card"
      onClick={() => onOpen(project)}
      aria-label={`View details for ${project.title}`}
    >
      <div className="project-card-visual">
        {project.image ? (
  <img
    src={project.image}
    alt={project.title}
    className="project-image"
  />
) : (
  <ProjectArtwork visual={project.visual} />
)}
        <div className="project-card-overlay">
          <span>
            View Details <ExternalLink size={16} />
          </span>
        </div>
      </div>
      <div className="project-card-copy">
        <div className="project-meta">
          <span className="project-category">{project.category}</span>
          <span className="project-date">
            <CalendarDays size={13} /> {project.date}
          </span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p>{project.desc}</p>
      </div>
    </motion.button>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="project-modal"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details">
              <X size={21} />
            </button>
            {project.image ? (
  <img
    src={project.image}
    alt={project.title}
    className="project-image"
  />
) : (
  <ProjectArtwork visual={project.visual} />
)}
            <div className="modal-content">
              <div className="project-meta modal-meta">
                <span className="project-category">{project.category}</span>
                <span className="project-date">
                  <CalendarDays size={13} /> {project.date}
                </span>
              </div>
              <h2 id="project-modal-title">{project.title}</h2>
              <p className="modal-description">{project.detail}</p>
              {project.driveUrl ? (
                <a className="drive-link" href={project.driveUrl} target="_blank" rel="noreferrer">
                  View my work on Google Drive <ExternalLink size={17} />
                </a>
              ) : (
                <div className="drive-link drive-link-pending" aria-live="polite">
  <span>
    <strong>!</strong> Additional documentation is currently unavailable.
  </span>
</div>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContactForm() {
  const [formState, setFormState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      setFormState('unconfigured');
      return;
    }

    const formElement = event.currentTarget;
    setFormState('sending');

    try {
      const formData = new FormData(formElement);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const providerMessage = result?.errors?.map((item) => item.message).join(' ');
        throw new Error(providerMessage || 'The message could not be sent. Please try again.');
      }

      formElement.reset();
      setFormState('sent');
    } catch (error) {
      setFormState('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="contact-form-panel">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Your name" autoComplete="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="yourname@example.com" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows="4" placeholder="How can we collaborate?" required />
        </div>
        <input className="form-honeypot" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" aria-hidden="true" />

        <button className="send-button" type="submit" disabled={formState === 'sending'}>
          {formState === 'sending' ? 'Sending...' : 'Send Message'}
          {formState === 'sent' ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>

        <AnimatePresence mode="wait">
          {formState === 'sent' && (
            <motion.p className="form-feedback success" role="status" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Your message has been sent. Thank you for reaching out!
            </motion.p>
          )}
          {formState === 'unconfigured' && (
            <motion.p className="form-feedback notice" role="status" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              The form is ready, but email delivery has not been connected yet. Please use the email link or add your Formspree endpoint to <code>.env.local</code>.
            </motion.p>
          )}
          {formState === 'error' && (
            <motion.p className="form-feedback error" role="alert" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
        <p className="form-footnote">Your details will only be used to respond to your message.</p>
      </form>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInterestImage, setSelectedInterestImage] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => activeProjectFilter === 'All' || project.category === activeProjectFilter),
    [activeProjectFilter],
  );

  const navigation = ['About', 'Education', 'Experience', 'Projects', 'Skills'];
  const mobileNavigation = [...navigation, 'Contact'];

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeInOut' } }}
          >
            <motion.div
              className="loading-title"
              initial={{ opacity: 0, letterSpacing: '0px' }}
              animate={{ opacity: 1, letterSpacing: '2px' }}
              transition={{ duration: 1.05, ease: 'easeOut' }}
            >
              <span>{identity.name}'s</span>
              <em>Portfolio</em>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand-name" onClick={() => setIsMenuOpen(false)}>
            {identity.name}<span>.</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
                <span />
              </a>
            ))}
            <a
  className="nav-cta"
  href="/mel-resume.pdf"
  download="mel-resume.pdf"
>
  Download CV <Download size={16} />
</a>
          </nav>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={27} /> : <Menu size={27} />}
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {mobileNavigation.map((item) => (
  <a
    key={item}
    href={`#${item.toLowerCase()}`}
    onClick={() => setIsMenuOpen(false)}
  >
    {item}
  </a>
))}

<a
  className="nav-cta mobile-nav-cta"
  href="/mel-resume.pdf"
  download="mel-resume.pdf"
  onClick={() => setIsMenuOpen(false)}
>
  Download CV <Download size={16} />
</a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Section id="home" className="hero-section">
          <div className="hero-grid">
            <motion.div className="hero-copy" variants={stagger} initial="hidden" animate={!isLoading ? 'visible' : 'hidden'}>
              <motion.div variants={fadeUp}>
                <span className="hero-pill">{hero.label}</span>
              </motion.div>
              <motion.h1 variants={fadeUp}>
                Building a <em>Healthier Future</em>,<br className="desktop-break" /> One Smile at a Time.
              </motion.h1>
              <motion.p className="hero-description" variants={fadeUp}>{hero.description}</motion.p>
              <motion.div className="hero-actions" variants={fadeUp}>
                <a className="button-primary" href="#projects">
                  Explore My Portfolio <ArrowRight size={18} className="button-arrow" />
                </a>
                <a className="button-outline" href="#contact">Get in Touch</a>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-portrait-wrap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={!isLoading ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.9, delay: 0.38, ease: 'easeOut' }}
            >
              <div className="portrait-glow portrait-glow-top" />
              <div className="portrait-glow portrait-glow-bottom" />
              <div className="hero-portrait-frame">
                <img src={identity.profileImage} alt={identity.name} fetchPriority="high" />
                <div className="portrait-shade" />
              </div>
              <motion.div
                className="current-role-card"
                animate={{ y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <span className="role-icon"><BookOpen size={23} /></span>
                <span>
                  <small>Current Role</small>
                  <strong>Dentistry Student | UGM</strong>
                </span>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        <Section id="about" className="about-section section-card">
          <SectionHeader label="GET TO KNOW ME" title={about.heading} />
          <div className="about-grid">
            <motion.div className="about-copy" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.18 }}>
              <motion.p variants={fadeUp}>{about.text1}</motion.p>
              <motion.p variants={fadeUp}>{about.text2}</motion.p>
              <motion.div className="about-quote" variants={fadeUp}>
                <p>“{about.quote}”</p>
              </motion.div>
            </motion.div>
            <motion.div className="highlight-list" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.18 }}>
              {about.highlights.map((item, index) => {
                const HighlightIcon = [BookOpen, Heart, Lightbulb][index];
                return (
                  <motion.div className="highlight-card" variants={fadeUp} key={item}>
                    <span><HighlightIcon size={24} /></span>
                    <h3>{item}</h3>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </Section>

        <Section id="education" className="education-section">
          <SectionHeader label="ACADEMIC BACKGROUND" title="My Educational Journey." />
          <div className="education-timeline">
            <div className="timeline-line" />
            {education.map((item, index) => (
              <motion.article
                className={`education-entry ${index % 2 === 0 ? 'entry-reverse' : ''}`}
                key={item.institution}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.18 }}
                transition={{ duration: 0.58, delay: index * 0.12 }}
              >
                <span className="timeline-dot" />
                <div className="education-spacer" />
                <div className="education-card">
                  <span className="education-years">{item.years}</span>
                  <h3>{item.institution}</h3>
                  <p className="education-faculty">{item.faculty}</p>
                  <p className="education-location"><MapPin size={15} /> {item.location}</p>
                  <p className="education-description">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="experience" className="experience-section">
          <Reveal className="experience-heading">
            <p className="eyebrow eyebrow-light">BEYOND THE CLASSROOM</p>
            <h2>Experiences That Shape Me.</h2>
          </Reveal>
          <div className="experience-grid">
            {experience.map((item, index) => (
              <motion.article
                className="experience-card"
                key={`${item.org}-${item.role}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.12 }}
                transition={{ duration: 0.48, delay: (index % 3) * 0.08 }}
              >
                <div className="experience-card-top">
                  <h3>{item.org}</h3>
                  <span className="experience-year">{item.year}</span>
                </div>
                <p className="experience-role">{item.role}</p>
                <p className="experience-description">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="projects" className="projects-section">
          <SectionHeader label="MY WORK" title="Learning Through Practice." />
          <div className="project-filters" role="group" aria-label="Filter projects by category">
            {projectCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={`filter-button ${activeProjectFilter === category ? 'active' : ''}`}
                aria-pressed={activeProjectFilter === category}
                onClick={() => setActiveProjectFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {filteredProjects.length > 0 ? (
            <motion.div layout className="projects-grid">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="empty-project-state"
              key={activeProjectFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <span><Sparkles size={23} /></span>
              <h3>No work in this category yet.</h3>
              <p>I’m still learning and building. New projects will appear here as my portfolio grows.</p>
            </motion.div>
          )}
        </Section>

        <Section id="skills" className="skills-section section-card">
          <SectionHeader label="WHAT I BRING" title="Skills Beyond the Classroom." />
          <div className="skills-grid">
            {skills.map((group, index) => (
              <motion.article
                className="skill-group"
                key={group.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.18 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <h3>{group.title}</h3>
                <div className="skill-pills">
                  {group.skills.map((skill) => (
                    <span className={`skill-pill ${group.style}`} key={skill}>{skill}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section id="interests" className="interests-section">
          <div className="interests-grid">
            <div className="interests-copy">
              <SectionHeader label="A LITTLE MORE ABOUT ME" title="Outside of Dentistry." />
              <p className="interests-description">
                While dentistry is my primary focus, I believe in maintaining a balanced life. Exploring different hobbies helps me stay grounded, creative, and physically active.
              </p>
              <div className="interest-tags">
                {interests.map((interest) => (
                  <span key={interest}>#{interest.toLowerCase().replaceAll(' ', '').replaceAll('&', '')}</span>
                ))}
              </div>
            </div>
            <div className="interest-mosaic">
             <Reveal
  className="interest-tile tile-large"
  onClick={() => setSelectedInterestImage({
    src: '/images/towerimage.jpeg',
    alt: 'Photography and Everyday Moments'
  })}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedInterestImage({
        src: '/images/towerimage.jpeg',
        alt: 'Photography and Everyday Moments'
      });
    }
  }}
>
               <img
                 src="/images/towerimage.jpeg"
                  alt="Photography and everyday moments"
                 className="interest-image"
              />
             <span>Photography & Everyday Moments</span>
              </Reveal>
              <Reveal
  className="interest-tile tile-sports"
  delay={0.08}
  onClick={() => setSelectedInterestImage({
    src: '/images/basketball.jpeg',
    alt: 'Sports and Fitness'
  })}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedInterestImage({
        src: '/images/basketball.jpeg',
        alt: 'Sports and Fitness'
      });
    }
  }}
>
                <img
                  src="/images/basketball.jpeg"
                 alt="Basketball and sports activities"
                  className="interest-image"
               />
               <span>Sports & Fitness</span>
              </Reveal>
              <Reveal
  className="interest-tile tile-creative"
  delay={0.16}
  onClick={() => setSelectedInterestImage({
    src: '/images/ucv.jpg',
    alt: 'Creative Projects'
  })}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedInterestImage({
        src: '/images/ucv.jpg',
        alt: 'Creative Projects'
      });
    }
  }}
>
                <img
                    src="/images/ucv.jpg"
                   alt="Creative projects"
                  className="interest-image"
                 />
                 <span>Creative Projects</span>
              </Reveal>
            </div>
          </div>
        </Section>

        <Section id="contact" className="contact-section">
          <div className="contact-glow" />
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="eyebrow eyebrow-light">LET'S CONNECT</p>
              <h2>Every Meaningful Connection Starts Somewhere.</h2>
              <p className="contact-intro">
                I am always open to connecting with fellow students, dental professionals, researchers, and individuals who share an interest in healthcare.
              </p>
              <div className="social-links">
                <a href={`mailto:${identity.email}`} className="social-link">
                  <span className="social-icon"><Mail size={20} /></span>
                  <span>{identity.email}</span>
                </a>
                <a href={identity.linkedin} target="_blank" rel="noreferrer" className="social-link">
                  <span className="social-icon"><Linkedin size={20} /></span>
                  <span>Melchior Alam Sidhi</span>
                </a>
                <a href={identity.instagram} target="_blank" rel="noreferrer" className="social-link">
                  <span className="social-icon"><Instagram size={20} /></span>
                  <span>@melchiora.s</span>
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="site-footer">
        <h2>{identity.name}<span>.</span></h2>
        <p className="footer-role">Aspiring Dentist | {identity.university}</p>
        <p className="footer-quote">“Continuously learning. Always striving to make a difference.”</p>
        <p className="copyright">© {new Date().getFullYear()} {identity.name}. All rights reserved.</p>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        <AnimatePresence>
  {selectedInterestImage && (
    <motion.div
      className="image-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedInterestImage(null)}
    >
      <button
        type="button"
        className="image-lightbox-close"
        onClick={() => setSelectedInterestImage(null)}
        aria-label="Close image"
      >
        <X size={26} />
      </button>

      <motion.img
        src={selectedInterestImage.src}
        alt={selectedInterestImage.alt}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      />
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}
