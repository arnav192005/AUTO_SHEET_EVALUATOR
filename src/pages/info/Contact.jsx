import React from 'react';
import InfoLayout from '../../components/InfoLayout';

const Contact = () => {
  return (
    <InfoLayout title="Contact Us">
      <p>Have questions about Enterprise pricing, custom integrations, or partnerships? We'd love to hear from you.</p>
      
      <form style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <input type="text" placeholder="First Name" className="flip-input" style={{ width: '100%' }} />
          <input type="text" placeholder="Last Name" className="flip-input" style={{ width: '100%' }} />
        </div>
        <input type="email" placeholder="Work Email" className="flip-input" />
        <select className="flip-input" style={{ appearance: 'none' }}>
          <option value="" disabled selected>How can we help?</option>
          <option value="sales">Sales & Enterprise Pricing</option>
          <option value="support">Technical Support</option>
          <option value="partnership">Partnerships</option>
        </select>
        <textarea placeholder="Your message..." className="flip-input" style={{ minHeight: '150px', paddingTop: '15px', resize: 'vertical' }}></textarea>
        <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>Send Message</button>
      </form>
    </InfoLayout>
  );
};
export default Contact;\n