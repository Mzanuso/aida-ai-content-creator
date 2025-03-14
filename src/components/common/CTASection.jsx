import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTASection = ({ user }) => {
  return (
    <section id="cta" className="bg-gradient-to-r from-blue-600 to-indigo-800 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg px-6 py-10 md:py-16 md:px-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Inizia a raccontare la tua storia
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-blue-100">
              Libera la tua creatività e condividi la tua unicità con il mondo.
            </p>
            <div className="mt-8 flex justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="white" size="lg">
                    Vai alla dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="white" size="lg">
                    Prova gratuitamente
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;