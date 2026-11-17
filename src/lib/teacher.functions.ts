import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string };

/** The caller must be the teacher and the student must be in one of her classes. */
async function assertTeacherOf(ctx: Ctx, studentId: string) {
  const { data: isTeacher } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "teacher" });
  if (!isTeacher) throw new Error("Solo la profesora puede hacer esto.");
  const { data: member } = await ctx.supabase.from("class_members").select("class_id").eq("user_id", studentId).maybeSingle();
  if (!member) throw new Error("Ese alumno no está en ninguna clase.");
  const { data: cls } = await ctx.supabase
    .from("classes")
    .select("id")
    .eq("id", member.class_id)
    .eq("teacher_id", ctx.userId)
    .maybeSingle();
  if (!cls) throw new Error("Ese alumno no está en tus clases.");
}

export const setStudentPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ studentId: z.string().uuid(), password: z.string().min(6).max(72) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertTeacherOf(context as unknown as Ctx, data.studentId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.studentId, { password: data.password });
    if (error) throw new Error("No se pudo cambiar la contraseña. Prueba con otra más larga o con números.");
    return { ok: true };
  });

export const deleteStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ studentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertTeacherOf(context as unknown as Ctx, data.studentId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.studentId);
    if (error) throw new Error("No se pudo eliminar al alumno.");
    return { ok: true };
  });
