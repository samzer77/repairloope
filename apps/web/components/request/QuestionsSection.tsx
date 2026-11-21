"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import type { SectionProps } from "@/components/request/shared";
import { api } from "@/lib/api";
import type { Question } from "@/lib/types";

export function QuestionsSection({ request, isOwner, busy, run }: SectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Questions ({request.questions.length})</h2>
      {request.questions.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune question pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {request.questions.map((q) => (
            <QuestionItem
              key={q.id}
              requestId={request.id}
              question={q}
              canAnswer={isOwner}
              busy={busy}
              run={run}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function QuestionItem({
  requestId, question, canAnswer, busy, run,
}: {
  requestId: string;
  question: Question;
  canAnswer: boolean;
  busy: boolean;
  run: SectionProps["run"];
}) {
  const [answer, setAnswer] = useState("");

  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <p className="text-sm">
        <span className="font-medium">{question.authorName}</span> : {question.text}
      </p>

      {question.answer ? (
        <p className="mt-2 rounded bg-slate-50 p-2 text-sm">Réponse : {question.answer}</p>
      ) : canAnswer ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Ta réponse"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <Button
            disabled={busy || answer.trim().length < 3}
            onClick={() => {
              run(() => api.requests.answer(requestId, question.id, answer.trim()));
              setAnswer("");
            }}
          >
            Répondre
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">En attente de réponse du propriétaire.</p>
      )}
    </li>
  );
}
