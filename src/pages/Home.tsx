import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Atom, Sparkles, Globe, Github } from "lucide-react";


const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/30 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
            <Atom className="w-4 h-4" />
            <span>Quantum Cryptography Simulator</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-quantum bg-clip-text text-transparent leading-tight">
            BB84 Protocol
            <br />
            <span className="text-4xl md:text-6xl">3D Visualization</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience quantum key distribution in an interactive 3D environment. 
            Watch photons travel through space, see basis matching in real-time, 
            and understand the foundation of quantum-safe communication.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/simulation">
              <Button 
                size="lg" 
                className="bg-gradient-quantum hover:shadow-glow-primary transition-all duration-300 group"
              >
                Start 3D Simulation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/theory">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                Learn the Theory
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Atom className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Photon Polarization</h3>
            <p className="text-muted-foreground">
              Visualize vertical, horizontal, and diagonal polarization states 
              of individual photons in 3D space.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Basis Matching</h3>
            <p className="text-muted-foreground">
              Watch Alice and Bob's measurement bases align or differ, 
              color-coded for instant understanding.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg hover:border-secondary/50 transition-colors">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Keys</h3>
            <p className="text-muted-foreground">
              Extract the secret key from matched measurements and detect 
              eavesdropping attempts.
            </p>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-quantum bg-clip-text text-transparent">
              Meet the Team
            </h2>
            <p className="text-muted-foreground text-lg">
              The minds behind this quantum cryptography simulator
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Gowreesh V T",
                role: "Simulation Lead",
                description: "Meta Certified Full-Stack Developer",
                color: "primary",
                portfolio: "https://gowreesh.works",
                github: "https://github.com/Gowreesh-VT"
              },
              {
                name: "Pranav A",
                role: "Report Writer",
                description: "Aspiring Quantum Researcher",
                color: "secondary",
                portfolio: "../../pranav/pranav.html",
                github: "https://github.com/pranav-a"
              },
              {
                name: "Surya S",
                role: "PPT Creator",
                description: "Quantum cryptography enthusiast",
                color: "destructive",
                portfolio: "https://doortosurya.me",
                github: "https://github.com/surya-749"
              },
              {
                name: "Naveena Priyan",
                role: "UI/UX Designer and Content Researcher",
                description: "Passionate about making complex topics accessible",
                color: "accent",
                portfolio: "../../naveena/naveena.html",
                github: "https://github.com/naveena-priyan"
              }
            ].map((member, index) => (
              <div 
                key={member.name}
                className="group p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-${member.color}/20 flex items-center justify-center text-3xl font-bold text-${member.color} group-hover:scale-110 transition-transform`}>
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                <p className="text-sm text-primary text-center mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground text-center mb-4">{member.description}</p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-4">
                  {member.portfolio && (
                    <a 
                      href={member.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      aria-label="Portfolio"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
