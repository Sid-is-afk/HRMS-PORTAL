import { create } from 'zustand';
import { employeeService } from '../services/employeeService';

export const useEmployeeManagementStore = create((set, get) => ({
  employees: [],
  selectedEmployee: null,
  departments: [],
  designations: [],
  managers: [],

  isLoading: false,
  isRefreshing: false,
  error: null,

  searchQuery: '',
  filters: {
    departmentId: 'all',
    designationId: 'all',
    status: 'all',
    type: 'all',
    role: 'all',
  },

  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().loadEmployees(1);
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().loadEmployees(1);
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      filters: {
        departmentId: 'all',
        designationId: 'all',
        status: 'all',
        type: 'all',
        role: 'all',
      },
    });
    get().loadEmployees(1);
  },

  loadMetadata: async () => {
    try {
      const [depts, desigs, mgrs] = await Promise.all([
        employeeService.getDepartments(),
        employeeService.getDesignations(),
        employeeService.getManagers(),
      ]);
      set({ departments: depts, designations: desigs, managers: mgrs });
    } catch {
      // Quiet fail metadata loading
    }
  },

  loadEmployees: async (pageNumber = 1) => {
    set({ isLoading: pageNumber === 1, error: null });
    const { searchQuery, filters, pagination } = get();

    try {
      const result = await employeeService.getEmployees({
        search: searchQuery,
        ...filters,
        page: pageNumber,
        limit: pagination.limit,
      });

      set((state) => ({
        employees: pageNumber === 1 ? result.data : [...state.employees, ...result.data],
        pagination: result.pagination,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to load employees', isLoading: false });
    }
  },

  refreshEmployees: async () => {
    set({ isRefreshing: true, error: null });
    const { searchQuery, filters, pagination } = get();

    try {
      const result = await employeeService.getEmployees({
        search: searchQuery,
        ...filters,
        page: 1,
        limit: pagination.limit,
      });

      set({
        employees: result.data,
        pagination: result.pagination,
        isRefreshing: false,
      });
    } catch (err) {
      set({ error: err.message || 'Failed to refresh employees', isRefreshing: false });
    }
  },

  loadEmployeeDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const employee = await employeeService.getEmployee(id);
      set({ selectedEmployee: employee, isLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load employee details', isLoading: false });
    }
  },

  createEmployee: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newEmp = await employeeService.createEmployee(data);
      set({ isLoading: false });
      get().refreshEmployees();
      return newEmp;
    } catch (err) {
      set({ error: err.message || 'Failed to create employee', isLoading: false });
      throw err;
    }
  },

  updateEmployee: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await employeeService.updateEmployee(id, data);
      set({ selectedEmployee: updated, isLoading: false });
      get().refreshEmployees();
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update employee', isLoading: false });
      throw err;
    }
  },

  deactivateEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await employeeService.deactivateEmployee(id);
      set({ selectedEmployee: updated, isLoading: false });
      get().refreshEmployees();
    } catch (err) {
      set({ error: err.message || 'Failed to deactivate employee', isLoading: false });
    }
  },

  activateEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await employeeService.activateEmployee(id);
      set({ selectedEmployee: updated, isLoading: false });
      get().refreshEmployees();
    } catch (err) {
      set({ error: err.message || 'Failed to activate employee', isLoading: false });
    }
  },
}));
