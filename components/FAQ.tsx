"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { FAQ_ITEMS } from "@/lib/siteConfig";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq">
      <div className="container">
        <Reveal as="div" className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Dúvidas frequentes</h2>
        </Reveal>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div className={"faq-item" + (open ? " open" : "")} key={item.question}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  {item.question}
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-answer" id={`faq-answer-${i}`} role="region">
                  <div className="faq-answer-inner">
                    {item.answer}
                    {item.needsConfirmation && (
                      <span className="faq-provisional">
                        (resposta provisória — a confirmar)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
