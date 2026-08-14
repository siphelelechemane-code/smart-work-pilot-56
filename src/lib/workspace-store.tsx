import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Priority = "Urgent" | "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  estimatedDuration: string;
  suggestedSlot: string;
  reason: string;
  deadline?: string;
  completed: boolean;
};

export type Activity = {
  id: string;
  tool: string;
  detail: string;
  at: string;
};

type State = {
  tasks: Task[];
  activity: Activity[];
  studied: string[];
};

type Store = State & {
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, direction: -1 | 1) => void;
  removeTask: (id: string) => void;
  toggleStudied: (key: string) => void;
  logActivity: (tool: string, detail: string) => void;
  clearActivity: () => void;
  ready: boolean;
};

const STORAGE_KEY = "aiwpa-workspace-v1";
const empty: State = { tasks: [], activity: [], studied: [] };

const WorkspaceContext = createContext<Store | null>(null);

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...empty, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, ready]);

  const setTasks = useCallback((tasks: Task[]) => setState((s) => ({ ...s, tasks })), []);

  const addTasks = useCallback(
    (tasks: Task[]) => setState((s) => ({ ...s, tasks: [...s.tasks, ...tasks] })),
    [],
  );

  const toggleStudied = useCallback((key: string) => {
    setState((s) => ({
      ...s,
      studied: s.studied.includes(key)
        ? s.studied.filter((k) => k !== key)
        : [...s.studied, key],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const moveTask = useCallback((id: string, direction: -1 | 1) => {
    setState((s) => {
      const index = s.tasks.findIndex((t) => t.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= s.tasks.length) return s;
      const tasks = [...s.tasks];
      const [moved] = tasks.splice(index, 1);
      if (moved) tasks.splice(target, 0, moved);
      return { ...s, tasks };
    });
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const logActivity = useCallback((tool: string, detail: string) => {
    setState((s) => ({
      ...s,
      activity: [{ id: newId(), tool, detail, at: new Date().toISOString() }, ...s.activity].slice(
        0,
        20,
      ),
    }));
  }, []);

  const clearActivity = useCallback(() => setState((s) => ({ ...s, activity: [] })), []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      setTasks,
      addTasks,
      toggleTask,
      updateTask,
      moveTask,
      removeTask,
      toggleStudied,
      logActivity,
      clearActivity,
    }),
    [
      state,
      ready,
      setTasks,
      addTasks,
      toggleTask,
      updateTask,
      moveTask,
      removeTask,
      toggleStudied,
      logActivity,
      clearActivity,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}