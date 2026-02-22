import React from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;