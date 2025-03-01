import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Customers from '../views/Customers.vue';
import Products from '../views/Products.vue';
import Invoices from '../views/Invoices.vue';
import InvoiceDetail from '../views/InvoiceDetail.vue';
import CreateInvoice from '../views/CreateInvoice.vue';
import Projects from '../views/Projects.vue';
import ProjectDetail from '../views/ProjectDetail.vue';
import CreateProject from '../views/CreateProject.vue';
import Fleet from '../views/Fleet.vue';
import VehicleDetail from '../views/VehicleDetail.vue';
import CreateVehicle from '../views/CreateVehicle.vue';
import Drivers from '../views/Drivers.vue';
import DriverDetail from '../views/DriverDetail.vue';
import CreateDriver from '../views/CreateDriver.vue';
import Routes from '../views/Routes.vue';
import RouteDetail from '../views/RouteDetail.vue';
import CreateRoute from '../views/CreateRoute.vue';
import Facilities from '../views/Facilities.vue';
import FacilityDetail from '../views/FacilityDetail.vue';
import CreateFacility from '../views/CreateFacility.vue';
import Rooms from '../views/Rooms.vue';
import RoomDetail from '../views/RoomDetail.vue';
import CreateRoom from '../views/CreateRoom.vue';
import Maintenance from '../views/Maintenance.vue';
import CreateMaintenance from '../views/CreateMaintenance.vue';
import UtilityConsumption from '../views/UtilityConsumption.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/customers',
      name: 'customers',
      component: Customers
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices
    },
    {
      path: '/invoices/:id',
      name: 'invoice-detail',
      component: InvoiceDetail
    },
    {
      path: '/invoices/create',
      name: 'create-invoice',
      component: CreateInvoice
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetail
    },
    {
      path: '/projects/create',
      name: 'create-project',
      component: CreateProject
    },
    {
      path: '/fleet',
      name: 'fleet',
      component: Fleet
    },
    {
      path: '/fleet/vehicles/:id',
      name: 'vehicle-detail',
      component: VehicleDetail
    },
    {
      path: '/fleet/vehicles/create',
      name: 'create-vehicle',
      component: CreateVehicle
    },
    {
      path: '/fleet/drivers',
      name: 'drivers',
      component: Drivers
    },
    {
      path: '/fleet/drivers/:id',
      name: 'driver-detail',
      component: DriverDetail
    },
    {
      path: '/fleet/drivers/create',
      name: 'create-driver',
      component: CreateDriver
    },
    {
      path: '/fleet/routes',
      name: 'routes',
      component: Routes
    },
    {
      path: '/fleet/routes/:id',
      name: 'route-detail',
      component: RouteDetail
    },
    {
      path: '/fleet/routes/create',
      name: 'create-route',
      component: CreateRoute
    },
    // Facilities Management Routes
    {
      path: '/facilities',
      name: 'facilities',
      component: Facilities
    },
    {
      path: '/facilities/:id',
      name: 'facility-detail',
      component: FacilityDetail
    },
    {
      path: '/facilities/create',
      name: 'create-facility',
      component: CreateFacility
    },
    {
      path: '/facilities/:facilityId/rooms',
      name: 'rooms',
      component: Rooms
    },
    {
      path: '/facilities/:facilityId/rooms/:id',
      name: 'room-detail',
      component: RoomDetail
    },
    {
      path: '/facilities/:facilityId/rooms/create',
      name: 'create-room',
      component: CreateRoom
    },
    {
      path: '/facilities/:facilityId/maintenance',
      name: 'maintenance',
      component: Maintenance
    },
    {
      path: '/facilities/:facilityId/maintenance/create',
      name: 'create-maintenance',
      component: CreateMaintenance
    },
    {
      path: '/facilities/:facilityId/utilities',
      name: 'utility-consumption',
      component: UtilityConsumption
    }
  ]
});

export default router;