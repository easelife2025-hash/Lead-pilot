"use client";

import React, { useEffect, useState } from 'react';
import { app, db, auth } from '../lib/firebase';

export default function Page() {
  const [status, setStatus] = useState("Initializing Firebase...");

  useEffect(() => {
    if (app && db && auth) {
      setStatus("Firebase Connected Successfully!");
    } else {
      setStatus("Failed to connect Firebase.");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Aura Integration</h1>
      <p className="text-xl">{status}</p>
    </div>
  );
}
