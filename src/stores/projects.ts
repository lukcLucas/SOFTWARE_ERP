import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, addDays, addMonths } from 'date-fns';
import type { Project, ProjectTask, ProjectResource } from '../types';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([
    {
      id: '1',
      name: 'Desenvolvimento de Website',
      description: 'Criação de website responsivo com painel administrativo',
      customerId: '1',
      customerName: 'Empresa ABC Ltda',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addMonths(new Date(), 2), 'yyyy-MM-dd'),
      status: 'in_progress',
      budget: 15000,
      cost: 8500,
      tasks: [
        {
          id: '1',
          name: 'Design de Interface',
          description: 'Criação de wireframes e design final',
          startDate: format(new Date(), 'yyyy-MM-dd'),
          endDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
          status: 'completed',
          assignedTo: ['Designer UX/UI'],
          progress: 100
        },
        {
          id: '2',
          name: 'Desenvolvimento Frontend',
          description: 'Implementação do design em HTML/CSS/JS',
          startDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
          endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
          status: 'in_progress',
          assignedTo: ['Desenvolvedor Frontend'],
          progress: 60
        },
        {
          id: '3',
          name: 'Desenvolvimento Backend',
          description: 'Implementação da API e banco de dados',
          startDate: format(addDays(new Date(), 20), 'yyyy-MM-dd'),
          endDate: format(addDays(new Date(), 40), 'yyyy-MM-dd'),
          status: 'in_progress',
          assignedTo: ['Desenvolvedor Backend'],
          progress: 30
        }
      ],
      resources: [
        {
          id: '1',
          name: 'Designer UX/UI',
          type: 'human',
          cost: 3000,
          quantity: 1
        },
        {
          id: '2',
          name: 'Desenvolvedor Frontend',
          type: 'human',
          cost: 3500,
          quantity: 1
        },
        {
          id: '3',
          name: 'Desenvolvedor Backend',
          type: 'human',
          cost: 4000,
          quantity: 1
        },
        {
          id: '4',
          name: 'Hospedagem',
          type: 'service',
          cost: 500,
          quantity: 1
        }
      ]
    }
  ]);

  function addProject(project: Omit<Project, 'id'>) {
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    projects.value.push(newProject);
    return newProject;
  }

  function updateProject(id: string, data: Partial<Project>) {
    const index = projects.value.findIndex(p => p.id === id);
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...data };
      return projects.value[index];
    }
    return null;
  }

  function deleteProject(id: string) {
    const index = projects.value.findIndex(p => p.id === id);
    if (index !== -1) {
      projects.value.splice(index, 1);
      return true;
    }
    return false;
  }

  function addTask(projectId: string, task: Omit<ProjectTask, 'id'>) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const newTask = {
        ...task,
        id: Date.now().toString()
      };
      project.tasks.push(newTask);
      return newTask;
    }
    return null;
  }

  function updateTask(projectId: string, taskId: string, data: Partial<ProjectTask>) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...data };
        return project.tasks[taskIndex];
      }
    }
    return null;
  }

  function deleteTask(projectId: string, taskId: string) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project.tasks.splice(taskIndex, 1);
        return true;
      }
    }
    return false;
  }

  function addResource(projectId: string, resource: Omit<ProjectResource, 'id'>) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const newResource = {
        ...resource,
        id: Date.now().toString()
      };
      project.resources.push(newResource);
      return newResource;
    }
    return null;
  }

  function updateResource(projectId: string, resourceId: string, data: Partial<ProjectResource>) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const resourceIndex = project.resources.findIndex(r => r.id === resourceId);
      if (resourceIndex !== -1) {
        project.resources[resourceIndex] = { ...project.resources[resourceIndex], ...data };
        return project.resources[resourceIndex];
      }
    }
    return null;
  }

  function deleteResource(projectId: string, resourceId: string) {
    const project = projects.value.find(p => p.id === projectId);
    if (project) {
      const resourceIndex = project.resources.findIndex(r => r.id === resourceId);
      if (resourceIndex !== -1) {
        project.resources.splice(resourceIndex, 1);
        return true;
      }
    }
    return false;
  }

  function calculateProjectProgress(projectId: string) {
    const project = projects.value.find(p => p.id === projectId);
    if (!project || project.tasks.length === 0) return 0;
    
    const totalProgress = project.tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / project.tasks.length);
  }

  function calculateTotalCost(projectId: string) {
    const project = projects.value.find(p => p.id === projectId);
    if (!project) return 0;
    
    return project.resources.reduce((total, resource) => {
      return total + (resource.cost * resource.quantity);
    }, 0);
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addResource,
    updateResource,
    deleteResource,
    calculateProjectProgress,
    calculateTotalCost
  };
});