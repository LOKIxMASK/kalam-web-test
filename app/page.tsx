"use client";
import { MotionConfig } from "framer-motion";
import { AtmosphereProvider } from "@/components/Atmosphere";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SpaceBackground } from "@/components/SpaceBackground";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { WhatIs } from "@/components/sections/WhatIs";
import { PoweredBy } from "@/components/sections/PoweredBy";
import { AlwaysReady } from "@/components/sections/AlwaysReady";
import { VoiceFirst } from "@/components/sections/VoiceFirst";
import { Homework } from "@/components/sections/Homework";
import { NightStudy } from "@/components/sections/NightStudy";
import { Universe } from "@/components/sections/Universe";
import { LightDark } from "@/components/sections/LightDark";
import { Experience } from "@/components/sections/Experience";
import { Pricing } from "@/components/sections/Pricing";
import { Team } from "@/components/sections/Team";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <AtmosphereProvider>
        <SmoothScroll>
          <SpaceBackground />
          <Nav />
          <main>
            <Hero />
            <Manifesto />
            <WhatIs />
            <PoweredBy />
            <AlwaysReady />
            <VoiceFirst />
            <Homework />
            <NightStudy />
            <Universe />
            <Experience />
            <Pricing />
            <LightDark />
            <Team />
            <FinalCTA />
          </main>
          <Footer />
        </SmoothScroll>
      </AtmosphereProvider>
    </MotionConfig>
  );
}
