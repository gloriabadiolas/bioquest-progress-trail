-- Roles (only 'teacher' used for now)
CREATE TYPE public.app_role AS ENUM ('teacher');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  username text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Teacher reads profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Classes
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Class members (one class per student)
CREATE TABLE public.class_members (
  user_id uuid PRIMARY KEY,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.class_members TO authenticated;
GRANT ALL ON public.class_members TO service_role;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student reads own membership" ON public.class_members FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Teacher reads members" ON public.class_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teacher removes members" ON public.class_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teacher manages own classes" ON public.classes FOR ALL TO authenticated
  USING (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (teacher_id = auth.uid() AND public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Student reads own class" ON public.classes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = classes.id AND cm.user_id = auth.uid()));

-- Student progress (whole progress state as JSON)
CREATE TABLE public.student_progress (
  user_id uuid PRIMARY KEY,
  state jsonb NOT NULL DEFAULT '{"version":1,"records":{},"studyDays":[]}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.student_progress TO authenticated;
GRANT ALL ON public.student_progress TO service_role;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own progress" ON public.student_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert own progress" ON public.student_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own progress" ON public.student_progress FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Teacher reads progress" ON public.student_progress FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));

-- Public helper: class name for a join code (no other data exposed)
CREATE OR REPLACE FUNCTION public.class_name_for_code(_code text)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT name FROM public.classes WHERE code = upper(trim(_code)) LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.class_name_for_code(text) TO anon, authenticated;

-- Is there already a teacher?
CREATE OR REPLACE FUNCTION public.teacher_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'teacher')
$$;
GRANT EXECUTE ON FUNCTION public.teacher_exists() TO anon, authenticated;

-- First account that claims it becomes the teacher; nobody else can afterwards
CREATE OR REPLACE FUNCTION public.claim_teacher()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.class_members WHERE user_id = auth.uid()) THEN RETURN false; END IF;
  PERFORM pg_advisory_xact_lock(424242);
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'teacher') THEN
    RETURN public.has_role(auth.uid(), 'teacher');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'teacher');
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_teacher() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_teacher() TO authenticated;

-- On signup: create profile; students (with class_code) are enrolled or rejected
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _code text := upper(trim(coalesce(NEW.raw_user_meta_data->>'class_code', '')));
  _class uuid;
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'display_name', ''), NEW.raw_user_meta_data->>'username');
  IF _code <> '' THEN
    SELECT id INTO _class FROM public.classes WHERE code = _code;
    IF _class IS NULL THEN
      RAISE EXCEPTION 'CLASS_CODE_INVALID';
    END IF;
    INSERT INTO public.class_members (user_id, class_id) VALUES (NEW.id, _class);
    INSERT INTO public.student_progress (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up app rows when an account is deleted
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.class_members WHERE user_id = OLD.id;
  DELETE FROM public.student_progress WHERE user_id = OLD.id;
  RETURN OLD;
END $$;
CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_deleted_user();