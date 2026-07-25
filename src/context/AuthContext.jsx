import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase, isSupabaseConfigured, createTempClient } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage('kobi_currentUser', null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  // ── LOCAL STORAGE MOCK DATABASE (OFFLINE MODE FALLBACK) ────────────────────
  const [users, setUsers] = useLocalStorage('kobi_users_db', [
    {
      id: 'superadmin_1',
      email: 'osmanamil@gmail.com',
      password: '123',
      role: 'superadmin',
      name: 'Kobi Sistem Yöneticisi'
    },
    {
      id: 'danisman_1',
      email: 'danisman@kobi.com',
      password: '123',
      role: 'danisman',
      name: 'Ahmet Yılmaz',
      assignedCompanies: ['comp_1']
    },
    {
      id: 'firma_1',
      email: 'firma@sirket.com',
      password: '123',
      role: 'firma_yetkilisi',
      name: 'Mehmet Kaya',
      companyId: 'comp_1'
    },
    {
      id: 'calisan_1',
      email: 'calisan@sirket.com',
      password: '123',
      role: 'calisan',
      name: 'Ayşe Demir',
      companyId: 'comp_1'
    }
  ]);

  const [companies, setCompanies] = useLocalStorage('kobi_companies_db', [
    {
      id: 'comp_1',
      name: 'Örnek Teknoloji A.Ş.',
      employeeLimit: 50,
      activeModules: [
        'checkup', 'strategy', 'tasks', 'meetings', 'summary',
        'hr', 'recruitment', 'jobEvaluation', 'salaryManagement',
        'psychometrics', 'performance', 'training', 'exitAnalytics', 'engagement'
      ]
    }
  ]);

  // ── SUPABASE SYNCHRONIZATION (ONLINE MODE) ──────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Listen to Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch user profile from public.profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && !error) {
          setCurrentUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            companyId: profile.company_id,
            assignedCompanies: profile.assigned_companies || []
          });
        } else {
          // If profile table doesn't have it yet, set auth user metadata
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'Kullanıcı',
            role: session.user.user_metadata?.role || 'calisan',
            companyId: session.user.user_metadata?.company_id || null,
            assignedCompanies: session.user.user_metadata?.assigned_companies || []
          });
        }
      } else {
        // Only clear user session if the logged-in user is NOT a local/mock user
        const storedUserRaw = window.localStorage.getItem('kobi_currentUser');
        let isLocal = false;
        if (storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw);
            const idStr = String(storedUser?.id || '');
            if (
              idStr.startsWith('superadmin_') ||
              idStr.startsWith('danisman_') ||
              idStr.startsWith('firma_') ||
              idStr.startsWith('calisan_') ||
              idStr.startsWith('user_')
            ) {
              isLocal = true;
            }
          } catch (e) {}
        }
        if (!isLocal) {
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    });

    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch online companies and profiles list when user is authenticated
  useEffect(() => {
    if (!isSupabaseConfigured || !currentUser) return;

    const fetchData = async () => {
      const { data: cos, error: coErr } = await supabase.from('companies').select('*');
      if (cos && !coErr) {
        const mappedCos = cos.map(c => ({
          id: c.id,
          name: c.name,
          employeeLimit: c.employee_limit,
          activeModules: c.active_modules || []
        }));
        setCompanies(mappedCos);
      }
      const { data: usrs, error: usrErr } = await supabase.from('profiles').select('*');
      if (usrs && !usrErr) {
        const mappedUsers = usrs.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          companyId: u.company_id,
          assignedCompanies: u.assigned_companies || []
        }));
        setUsers(mappedUsers);
      }
    };
    fetchData();
  }, [currentUser]);

  // Migration/Fix: Ensure osmanamil@gmail.com is the only superadmin, remove admin@kobi.com
  useEffect(() => {
    if (!users || !Array.isArray(users)) return;
    const hasAdmin = users.some(u => u.email === 'admin@kobi.com');
    const hasOsman = users.some(u => u.email === 'osmanamil@gmail.com');
    
    if (hasAdmin || !hasOsman) {
      const filtered = users.filter(u => u.email !== 'admin@kobi.com');
      if (!filtered.some(u => u.email === 'osmanamil@gmail.com')) {
        filtered.unshift({
          id: 'superadmin_1',
          email: 'osmanamil@gmail.com',
          password: '123',
          role: 'superadmin',
          name: 'Kobi Sistem Yöneticisi'
        });
      }
      setUsers(filtered);
    }
  }, [users, setUsers]);

  // ── AUTHENTICATION METHODS ──────────────────────────────────────────────────
  const login = async (email, password) => {
    // Hardcoded fallback for default test accounts to guarantee they always work
    if (email === 'osmanamil@gmail.com' && password === '123') {
      const superadminUser = {
        id: 'superadmin_1',
        email: 'osmanamil@gmail.com',
        role: 'superadmin',
        name: 'Osman Amil'
      };
      setCurrentUser(superadminUser);
      return { success: true, user: superadminUser };
    }
    if (email === 'danisman@kobi.com' && password === '123') {
      const danismanUser = {
        id: 'danisman_1',
        email: 'danisman@kobi.com',
        role: 'danisman',
        name: 'Ahmet Yılmaz',
        assignedCompanies: ['comp_1']
      };
      setCurrentUser(danismanUser);
      return { success: true, user: danismanUser };
    }
    if (email === 'firma@sirket.com' && password === '123') {
      const firmaUser = {
        id: 'firma_1',
        email: 'firma@sirket.com',
        role: 'firma_yetkilisi',
        name: 'Mehmet Kaya',
        companyId: 'comp_1'
      };
      setCurrentUser(firmaUser);
      return { success: true, user: firmaUser };
    }
    if (email === 'calisan@sirket.com' && password === '123') {
      const calisanUser = {
        id: 'calisan_1',
        email: 'calisan@sirket.com',
        role: 'calisan',
        name: 'Ayşe Demir',
        companyId: 'comp_1'
      };
      setCurrentUser(calisanUser);
      return { success: true, user: calisanUser };
    }

    // Check local mock database first for other custom local users
    const localUser = users.find(u => u.email === email && u.password === password);

    if (isSupabaseConfigured) {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback to local database user if Supabase auth fails (in case local DB has custom credentials)
        if (localUser) {
          setCurrentUser(localUser);
          setIsLoading(false);
          return { success: true, user: localUser };
        }
        setIsLoading(false);
        return { success: false, message: error.message };
      }

      // Fetch profile immediately to prevent race conditions in ProtectedRoute
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userProfile = profile 
        ? {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            companyId: profile.company_id,
            assignedCompanies: profile.assigned_companies || []
          }
        : {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || 'Kullanıcı',
            role: data.user.user_metadata?.role || 'calisan',
            companyId: data.user.user_metadata?.company_id || null,
            assignedCompanies: data.user.user_metadata?.assigned_companies || []
          };

      setCurrentUser(userProfile);
      setIsLoading(false);
      return { success: true, user: userProfile };
    } else {
      if (localUser) {
        setCurrentUser(localUser);
        return { success: true, user: localUser };
      }
      return { success: false, message: 'Geçersiz e-posta veya şifre' };
    }
  };

  const shouldUseSupabase = () => {
    if (!isSupabaseConfigured) return false;
    if (!currentUser) return false;
    const idStr = String(currentUser.id);
    if (
      idStr.startsWith('superadmin_') ||
      idStr.startsWith('danisman_') ||
      idStr.startsWith('firma_') ||
      idStr.startsWith('calisan_') ||
      idStr.startsWith('user_')
    ) {
      return false;
    }
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const addUser = async (userData) => {
    if (shouldUseSupabase()) {
      // Use temp client to prevent session hijacking/signout of current superadmin
      const tempClient = createTempClient();
      const { data, error } = await tempClient.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            company_id: userData.companyId,
            assigned_companies: userData.assignedCompanies || []
          }
        }
      });
      if (error) throw error;

      // 2. Fetch profiles again to sync
      const newUser = {
        id: data.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        companyId: userData.companyId,
        assignedCompanies: userData.assignedCompanies || []
      };
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } else {
      const newUser = { ...userData, id: `user_${Date.now()}` };
      setUsers(prev => [...prev, newUser]);
      return newUser;
    }
  };

  const addCompany = async (companyData) => {
    if (shouldUseSupabase()) {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          employee_limit: companyData.employeeLimit,
          active_modules: companyData.activeModules
        })
        .select()
        .single();

      if (error) throw error;
      setCompanies(prev => [...prev, data]);
      return data;
    } else {
      const newCompany = { ...companyData, id: `comp_${Date.now()}`, name: companyData.name, employeeLimit: companyData.employeeLimit, activeModules: companyData.activeModules };
      setCompanies(prev => [...prev, newCompany]);
      return newCompany;
    }
  };

  const updateCompany = async (compId, updatedData) => {
    if (shouldUseSupabase()) {
      const { error } = await supabase
        .from('companies')
        .update({
          name: updatedData.name,
          employee_limit: updatedData.employeeLimit,
          active_modules: updatedData.activeModules
        })
        .eq('id', compId);

      if (error) throw error;
      setCompanies(prev => prev.map(c => c.id === compId ? { 
        ...c, 
        name: updatedData.name !== undefined ? updatedData.name : c.name,
        employeeLimit: updatedData.employeeLimit !== undefined ? updatedData.employeeLimit : c.employeeLimit,
        activeModules: updatedData.activeModules !== undefined ? updatedData.activeModules : c.activeModules
      } : c));
    } else {
      setCompanies(prev => prev.map(c => c.id === compId ? { ...c, ...updatedData } : c));
    }
  };

  const updateUser = async (userId, updatedData) => {
    if (shouldUseSupabase()) {
      const updatePayload = {};
      if (updatedData.name !== undefined) updatePayload.name = updatedData.name;
      if (updatedData.role !== undefined) updatePayload.role = updatedData.role;
      if (updatedData.companyId !== undefined) updatePayload.company_id = updatedData.companyId;
      if (updatedData.assignedCompanies !== undefined) updatePayload.assigned_companies = updatedData.assignedCompanies;

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state profiles cache
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    }
  };

  const adminUpdateUser = async (userId, updatedData) => {
    if (shouldUseSupabase()) {
      const { error } = await supabase.rpc('admin_update_user', {
        target_user_id: userId,
        new_email: updatedData.email,
        new_password: updatedData.password,
        new_name: updatedData.name,
        new_role: updatedData.role
      });
      if (error) throw error;
      
      // Update local state cache
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      companies,
      isLoading,
      login,
      logout,
      addUser,
      addCompany,
      updateCompany,
      updateUser,
      adminUpdateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
