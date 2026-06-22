import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { EXAM_TYPES, SEMESTERS, YEARS } from "@/lib/constants";
import { useSubjects } from "@/lib/use-subjects";
import { useBranches } from "@/lib/use-branches";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BranchMultiPicker } from "@/components/branch-multi-picker";
import { Upload as UploadIcon, FileText, X, Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { HoverButton } from "@/components/ui/hover-button";
import { Button } from "@/components/ui/button";

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
  const { user, profile, isAdmin, loading } = useAuth();
  const { branches } = useBranches({ admin: true, forUpload: true });
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [semester, setSemester] = useState<string>(profile?.semester ? String(profile.semester) : "");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [examType, setExamType] = useState("End Term");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploaderName, setUploaderName] = useState(profile?.display_name || "VaultAdmin");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const primaryBranch = selectedBranches[0] || "";
  const { subjects } = useSubjects(primaryBranch, semester ? Number(semester) : null);

  if (!loading && !isAdmin) {
    return <Navigate to="/contribute" replace />;
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
      const fileName = `papers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("papers").upload(fileName, file, {
        contentType: "application/pdf",
      });
      if (upErr) throw upErr;

      const publishGroupId = d.branches.length > 1 ? crypto.randomUUID() : null;
      const branchTags = [
        ...tags,
        ...d.branches.map((b) => `branch-${b.toLowerCase()}`),
        ...(d.branches.length > 1 ? ["shared-across-branches"] : []),
      ];
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
        approved: true,
        publish_group_id: publishGroupId,
      }));

      const { error: insErr } = await supabase.from("papers").insert(rows);
      if (insErr) throw insErr;

      toast.success(
        d.branches.length > 1
          ? `Published across ${d.branches.length} branches (synced file references).`
          : "Paper published successfully."
      );
      nav("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Upload Portal</h1>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Publish documents directly. Single file reference will automatically sync across multiple selected branches.
        </p>
      </div>

      <form onSubmit={submit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          )}
        >
          {file ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="font-semibold text-sm truncate text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <UploadIcon className="h-9 w-9 mx-auto text-muted-foreground mb-3" />
              <p className="font-bold text-sm text-foreground">Drag & drop a PDF file here</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">or click to browse local files (max 20MB)</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => pickFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>

        <Field label="Uploader attribution name">
          <Input value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} required className="rounded-xl h-11 text-xs" />
        </Field>

        <Field label="Target branches (multi-select)">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-primary uppercase mb-2">
            <Layers className="h-3.5 w-3.5" />
            {selectedBranches.length > 1
              ? `Publishing to ${selectedBranches.length} branch catalogs`
              : "Select target branches"}
          </div>
          <BranchMultiPicker branches={branches} selected={selectedBranches} onChange={setSelectedBranches} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Semester">
            <Select value={semester} onValueChange={(v) => { setSemester(v); setSubject(""); }}>
              <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Subject">
            {subjects.length > 0 ? (
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject name" className="rounded-xl h-11 text-xs" />
            )}
          </Field>
          <Field label="Exam year">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Exam type">
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Resource Title (optional)">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DBMS End Sem 2024" maxLength={200} className="rounded-xl h-11 text-xs" />
        </Field>

        <Field label="Description (optional)">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes or metadata about this paper…" maxLength={1000} rows={3} className="rounded-2xl text-xs" />
        </Field>

        <Field label="Tags">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="e.g. important, solved"
              className="rounded-xl h-11 text-xs"
            />
            <Button type="button" variant="outline" onClick={addTag} className="rounded-xl h-11 text-xs font-semibold px-4">Add Tag</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="cursor-pointer font-medium text-[10px] pl-2 py-0.5 rounded-lg" onClick={() => setTags(tags.filter((x) => x !== t))}>
                  #{t} <X className="h-3 w-3 ml-1 text-muted-foreground hover:text-destructive" />
                </Badge>
              ))}
            </div>
          )}
        </Field>

        <HoverButton type="submit" disabled={submitting} className="w-full h-11 rounded-xl">
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadIcon className="h-4 w-4 mr-2" />}
          Publish paper
        </HoverButton>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-0.5">{label}</Label>
      {children}
    </div>
  );
}
