-- Allow admins to view all user roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to grant roles
CREATE POLICY "Admins can grant roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to revoke roles
CREATE POLICY "Admins can revoke roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));