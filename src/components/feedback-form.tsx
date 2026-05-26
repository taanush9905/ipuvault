import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

type Props = { id?: string; className?: string };

export function FeedbackForm({ id = "feedback", className }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName || !trimmedMsg) {
      toast.error("Please enter your name and feedback");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("feedbacks").insert({
      name: trimmedName,
      feedback: trimmedMsg,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("feedbacks")
        ? "Feedback table missing — run supabase/setup-features.sql in Supabase SQL Editor"
        : error.message);
      return;
    }
    toast.success("Thank you! Your feedback was sent to the admin.");
    setName("");
    setMessage("");
  }

  return (
    <form id={id} onSubmit={submit} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${id}-name`} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your name
          </Label>
          <Input
            id={`${id}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Sharma"
            required
            className="mt-1.5 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor={`${id}-msg`} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Feedback
          </Label>
          <Textarea
            id={`${id}-msg`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share suggestions, report issues, or tell us what helped you…"
            required
            rows={5}
            className="mt-1.5 rounded-xl resize-y min-h-[120px]"
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full sm:w-auto rounded-xl gap-2">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit feedback
        </Button>
      </div>
    </form>
  );
}
