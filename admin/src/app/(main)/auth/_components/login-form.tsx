"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // /auth/login trả requiresOtp:true cho thiết bị lạ (chưa từng đăng nhập
  // trên trình duyệt này) — CÙNG cơ chế OTP dùng cho khách hàng (auth.routes.ts),
  // nhưng form đăng nhập admin trước đây không xử lý case này: cứ coi như
  // luôn thành công, lưu token undefined vào localStorage rồi bị ProtectedRoute
  // đá ngược lại /auth/login, lặp vô hạn không rõ lý do (token "undefined"
  // luôn bị coi là hết hạn). Thêm bước nhập OTP dưới đây để xử lý đúng case đó.
  const [otpStep, setOtpStep] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pendingCreds, setPendingCreds] = useState<{ email: string; password: string } | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function finishLogin(response: { token: string; user: any }) {
    // Save token + user info so the header can show who's actually logged in
    localStorage.setItem("admin_token", response.token);
    localStorage.setItem("admin_user", JSON.stringify(response.user));
    toast.success("Login successful!");
    void navigate("/dashboard");
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: any; requiresOtp?: boolean; challengeId?: string }>(
        "/auth/login",
        { email: data.email, password: data.password },
      );

      if (response.requiresOtp) {
        setChallengeId(response.challengeId || "");
        setPendingCreds({ email: data.email, password: data.password });
        setOtpStep(true);
        toast.info("Thiết bị mới — vui lòng nhập mã xác minh vừa gửi tới email.");
        return;
      }

      finishLogin(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: any }>("/auth/login/verify-otp", {
        challengeId,
        code: otpCode,
      });
      finishLogin(response);
    } catch (error: any) {
      toast.error(error.message || "Mã xác minh không đúng hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    if (!pendingCreds) return;
    setIsLoading(true);
    try {
      const response = await api.post<{ token: string; user: any; requiresOtp?: boolean; challengeId?: string }>(
        "/auth/login",
        pendingCreds,
      );
      if (response.requiresOtp) {
        setChallengeId(response.challengeId || "");
        toast.success("Đã gửi lại mã xác minh.");
      } else {
        finishLogin(response);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể gửi lại mã xác minh.");
    } finally {
      setIsLoading(false);
    }
  }

  if (otpStep) {
    return (
      <form noValidate onSubmit={onVerifyOtp} className="flex flex-col gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="otp-code">Mã xác minh</FieldLabel>
          <Input
            id="otp-code"
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="Nhập mã 6 số"
            autoFocus
          />
        </Field>
        <Button className="w-full" type="submit" disabled={isLoading || otpCode.length !== 6}>
          {isLoading ? "Đang xác minh..." : "Xác nhận đăng nhập"}
        </Button>
        <button
          type="button"
          onClick={() => void resendOtp()}
          disabled={isLoading}
          className="text-sm text-muted-foreground hover:underline"
        >
          Gửi lại mã
        </button>
      </form>
    );
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="remember"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="login-remember"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="login-remember" className="font-normal">
                  Remember me for 30 days
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
