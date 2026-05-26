import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRANCHES, EXAM_TYPES, SEMESTERS, YEARS } from "@/lib/constants";
import { useSubjects } from "@/lib/use-subjects";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { cn } from "@/lib/utils";

const MAX_SIZE = 20 * 1024 * 1024;

const schema = z.object({
  branches: z.array(z.string()).min(1, "Select at least one branch"),
  semester: z.coerce.number().int().min(1).max(8),
  subject: z.string().min(1, "Subject required"),
  year: z.coerce.number().int().min(2000).max(2100),
  exam_type: z.string().min(1),
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  uploader_name: z.string().min(1, "Your name is required"),
});

export default function Upload() {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [semester, setSemester] = useState<string>(profile?.semester ? String(profile.semester) : "");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [examType, setExamType] = useState("End Term");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploaderName, setUploaderName] = useState(profile?.display_name || "");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const primaryBranch = selectedBranches[0] || "";
  const { subjects } = useSubjects(primaryBranch, semester ? Number(semester) : null);

  function toggleBranch(code: string) {
    setSelectedBranches((prev) =>
      prev.includes(code) ? prev.filter((b) => b !== code) : [...prev, code]
    );
    setSubject("");
  }

  function pickFile(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") return toast.error("PDF files only");
    if (f.size > MAX_SIZE) return toast.error("File must be under 20MB");
    setFile(f);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!t || tags.includes(t)) { setTagInput(""); return; }
    setTags([...tags, t]);
    setTagInput("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error("Select a PDF file");

    const parsed = schema.safeParse({
      branches: selectedBranches,
      semester,
      subject,
      year,
      exam_type: examType,
      title,
      description,
      uploader_name: uploaderName.trim(),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSubmitting(true);
    try {
      const d = parsed.data;
      const fileName = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("papers").upload(fileName, file, {
        contentType: "application/pdf",
      });
      if (upErr) throw upErr;

      const branchTags = [...tags, ...d.branches.map((b) => `branch-${b.toLowerCase()}`)];
      const rows = d.branches.map((branch) => ({
        branch,
        semester: d.semester,
        section: "-",
        subject: d.subject,
        year: d.year,
        exam_type: d.exam_type,
        title: d.title || null,
        description: d.description || null,
        tags: branchTags,
        file_path: fileName,
        file_size: file.size,
        uploader_name: d.uploader_name,
        uploader_id: user?.id ?? null,
        approved: false,
      }));

      const { error: insErr } = await supabase.from("papers").insert(rows);
      if (insErr) throw insErr;

      toast.success(
        d.branches.length > 1
          ? `Submitted for ${d.branches.length} branches — admin will review.`
          : "Submitted for admin review. It'll appear once approved."
      );
      nav("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(
        msg.includes("row-level security") || msg.includes("policy")
          ? "Upload blocked — run supabase/setup-features.sql in Supabase SQL Editor"
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload a paper</h1>
        <p className="text-muted-foreground mt-1">
          No login required. PDF only, 20MB max. Select one or more branches. Admin approves before publish.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
          className={cn(
            "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
            dragOver ? "border-primary bg-accent" : "border-border"
          )}
        >
          {file ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <UploadIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Drag & drop a PDF here</p>
              <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => pickFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>

        <Field label="Your name">
          <Input
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Name shown on the upload"
            required
          />
        </Field>

        <Field label="Branches (select all that apply)">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {BRANCHES.map((b) => {
              const checked = selectedBranches.includes(b.code);
              return (
                <label
                  key={b.code}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors",
                    checked ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleBranch(b.code)} />
                  <span className="text-sm font-medium">{b.code}</span>
                </label>
              );
            })}
          </div>
          {selectedBranches.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Selected: {selectedBranches.join(", ")}
            </p>
          )}
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Semester">
            <Select value={semester} onValueChange={(v) => { setSemester(v); setSubject(""); }}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Subject">
            {subjects.length > 0 ? (
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject name" />
            )}
          </Field>
          <Field label="Exam year">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Exam type">
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Title (optional)">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DBMS End Sem 2024" maxLength={200} />
        </Field>

        <Field label="Description (optional)">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes about this paper…" maxLength={1000} rows={3} />
        </Field>

        <Field label="Tags">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="important, solved…"
            />
            <Button type="button" variant="outline" onClick={addTag}>Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => setTags(tags.filter((x) => x !== t))}>
                  #{t} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </Field>

        <Button type="submit" disabled={submitting} className="w-full h-11">
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Upload paper
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
