"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";

type FormState = {
  email: string;
  password: string;
  fullName: string;
};

const defaultFormState: FormState = {
  email: "",
  password: "",
  fullName: ""
};

export function SignupForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          data: {
            full_name: formState.fullName
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage(
        "Account created. Check your inbox if email confirmation is enabled, then sign in with the same credentials."
      );
      setFormState(defaultFormState);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <Input
          value={formState.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Jordan Miles"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <Input
          type="email"
          value={formState.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="ops@mercurylite.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <Input
          type="password"
          value={formState.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Minimum 8 characters"
          minLength={8}
          required
        />
      </div>

      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-medium text-primary" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
