import Typography from "./Typography";

const Hero = () => {
  return (
    <section className="text-center max-w-2xl mx-auto mb-12">
      <Typography variant="hero" as={"h1"} className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 pb-4">
        Clean your files.
      </Typography>
      <Typography variant="body" className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
        Adios Metadata securely strips hidden data from your photos, videos, and documents directly in your browser. Complete privacy, zero uploads.
      </Typography>
    </section>
  );
};

export default Hero;
