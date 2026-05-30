import { useState } from "react";
import { BRANCHES, EXAM_TYPES, SEMESTERS, YEARS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  requester_name: z.string().min(1, "Your name is required"),
  requester_email: z.string().email().optional().or(z.literal("")),
  branch: z.string().optional(),
  semester: z.coerce.number().optional(),
  subject: z.string().optional(),
  year: z.coerce.number().optional(),
  exam_type: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  message: z.string().min(10, "Tell us what you want to contribute (min 10 chars)"),
});

export default function Contribute() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [examType, setExamType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      requester_name: name.trim(),
      requester_email: email.trim() || undefined,
      branch: branch || undefined,
      semester: semester ? Number(semester) : undefined,
      subject: subject || undefined,
      year: year ? Number(year) : undefined,
      exam_type: examType || undefined,
      title: title || undefined,
      description: description || undefined,
      message: message.trim(),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    try {
      const d = parsed.data;
      const { error } = await supabase.from("contribution_requests").insert({
        requester_name: d.requester_name,
        requester_email: d.requester_email || null,
        branch: d.branch || null,
        semester: d.semester ?? null,
        subject: d.subject || null,
        year: d.year ?? null,
        exam_type: d.exam_type || null,
        title: d.title || null,
        description: d.description || null,
        message: d.message,
      });
      if (error) throw error;
      toast.success("Contribution request sent — VaultTeam will review it.");
      setMessage("");
      setTitle("");
      setDescription("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not submit";
      toast.error(
        msg.includes("contribution_requests")
          ? "Run supabase/setup-premium.sql in Supabase SQL Editor first"
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary grid place-items-center shrink-0">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contribute</h1>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Share PYQs, notes, or resources with the community. Submit a request — our admins verify and publish approved material.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
        <Field label="Your name">
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name for attribution" />
        </Field>
        <Field label="Email (optional)">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="so we can reach you" />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Branch">
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Semester">
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Subject">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Year">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Exam type">
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Resource title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DBMS End Term 2024 PYQ" />
        </Field>
        <Field label="Details">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Links, file names, or extra context…" rows={3} />
        </Field>
        <Field label="Contribution message">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you're contributing and how we can access it (Drive link, etc.)"
            rows={4}
            required
          />
        </Field>

        <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl">
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Submit contribution request
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}
