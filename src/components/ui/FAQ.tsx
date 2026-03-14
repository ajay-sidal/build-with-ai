const faqs = [
  {
    question: "How does domain tokenization work?",
    answer: "When you register or bridge a domain through MARZ, our protocol mints a unique digital twin of your domain on the blockchain. This allows you to manage your domain as a Real World Asset (RWA) with full sovereign ownership."
  },
  {
    question: "How do I claim my 50 MARZ Credits?",
    answer: "Credits are automatically provisioned to your account the moment you deploy your first Sovereign Infrastructure service (Domain, Hosting, or SSL)."
  },
  {
    question: "Can I transfer my existing domains to MARZ?",
    answer: "Yes. Our bridge protocol supports standard Web2 domain transfers. Once transferred, you can 'Activate Sovereignty' to begin the tokenization process."
  },
  {
    question: "Do I need a crypto wallet to start?",
    answer: "No. You can start with a traditional email login. We provision a non-custodial 'Smart Sanctuary' wallet for you behind the scenes."
  }
];
export default function FAQ() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          Frequently Asked <span className="text-teal-500">Questions</span>
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/20">
              <summary className="w-full p-6 text-left flex justify-between items-center hover:bg-neutral-800/40 transition-colors cursor-pointer list-none">
                <span className="font-semibold text-neutral-200">{faq.question}</span>
                <span className="text-teal-500 text-xl group-open:hidden">+</span>
                <span className="text-teal-500 text-xl hidden group-open:inline">−</span>
              </summary>
              <div className="p-6 pt-0 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800/50">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
