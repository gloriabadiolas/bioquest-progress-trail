import { Bar } from "@/components/ProgressRing";
import { MedalBadge } from "@/components/MedalBadge";
import { medalFor, statsFor, type ProgressState } from "@/lib/progress";
import { SUBJECTS, subjectStats } from "@/lib/subject-progress";

export function SubjectProgress({ subject, state }: { subject: (typeof SUBJECTS)[number]; state: ProgressState }) {
  const stats = subjectStats(subject.exercises, state);
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-extrabold">{subject.name}</h3>
      {stats.total === 0 ? <p className="text-sm text-muted-foreground">Sin ejercicios publicados todavía.</p> : <>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Metric label="Realizados" value={`${stats.attempted}/${stats.total}`} />
          <Metric label="Resueltos" value={`${stats.solved}/${stats.total}`} />
          <Metric label="Intentos" value={String(stats.attempts)} />
          <Metric label="Puntos" value={String(stats.points)} />
        </div>
        <Bar value={stats.percent} />
        <p className="text-sm text-muted-foreground">{stats.percent}% resuelto · {stats.accuracy}% de acierto en el primer intento</p>
        <div className="space-y-3">
          {subject.topics.map((topic) => {
            const row = statsFor(topic.exercises, state);
            return <div key={topic.id} className="flex items-center gap-3 border-b border-border pb-2">
              <div className="min-w-0 flex-1"><p className="font-semibold">{topic.title}</p><p className="text-xs text-muted-foreground">{row.attempted} realizados · {row.solved}/{row.total} resueltos</p></div>
              <MedalBadge medal={medalFor(row.percent)} />
            </div>;
          })}
        </div>
        <h4 className="font-bold">Evolución diaria</h4>
        {stats.improvement !== null && <p className="text-sm font-semibold">Cambio de acierto entre el primer y último día: {stats.improvement > 0 ? "+" : ""}{stats.improvement} puntos porcentuales</p>}
        {stats.daily.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay historial diario. Los ejercicios anteriores siguen contabilizados.</p> :
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b border-border"><th className="py-2">Fecha</th><th>Intentos</th><th>Acierto inicial</th></tr></thead>
            <tbody>{stats.daily.slice(-14).map((day) => <tr key={day.day} className="border-b border-border"><td className="py-2">{new Date(`${day.day}T12:00:00Z`).toLocaleDateString("es-ES")}</td><td>{day.attempts}</td><td>{day.accuracy === null ? "—" : `${day.accuracy}%`}</td></tr>)}</tbody>
          </table></div>}
      </>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-muted-foreground">{label}</p><p className="text-xl font-extrabold">{value}</p></div>;
}