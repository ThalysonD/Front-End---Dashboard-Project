import SignIn from "layouts/authentication/sign-in";
import Dashboard from "layouts/dashboard";
import Employees from "layouts/tables";
import Clientes from "layouts/tablesClient";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignUpEmployees from "layouts/authentication/sign-up";
import SignUpClientes from "layouts/authentication/sign-up-client";
import SignOut from "layouts/authentication/sign-out";
import ForgotPassword from "layouts/authentication/forgot-password";
import PrivateRoute from "services/PrivateRoute";
import UserProfile from "layouts/user-profile";
import ClientProfile from "layouts/client-profile";

import Icon from "@mui/material/Icon";

const routes = [
  {
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Painel de Controle",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <PrivateRoute>{<Dashboard />}</PrivateRoute>,
  },
  {
    type: "collapse",
    name: "Funcionários",
    key: "employees",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/employees",
    component: <PrivateRoute>{<Employees />}</PrivateRoute>,
  },
  {
    key: "sign-up-employees",
    route: "/authentication/sign-up/employees",
    component: <PrivateRoute>{<SignUpEmployees />}</PrivateRoute>,
  },
  {
    key: "user-profile",
    route: "/user-profile/:id",
    component: <PrivateRoute>{<UserProfile />}</PrivateRoute>,
  },
  {
    type: "collapse",
    name: "Clientes",
    key: "clients",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/clients",
    component: <PrivateRoute>{<Clientes />}</PrivateRoute>,
  },
  {
    key: "sign-up-clientes",
    route: "/authentication/sign-up/clients",
    component: <PrivateRoute>{<SignUpClientes />}</PrivateRoute>,
  },
  {
    key: "client-profile",
    route: "/client-profile/:id",
    component: <PrivateRoute>{<ClientProfile />}</PrivateRoute>,
  },
  {
    type: "collapse",
    name: "Cobrança",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <PrivateRoute>{<Billing />}</PrivateRoute>,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "collapse",
    name: "Notificações",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <PrivateRoute>{<Notifications />}</PrivateRoute>,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <PrivateRoute>{<Profile />}</PrivateRoute>,
  },
  {
    key: "forgot-password",
    route: "/authentication/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "collapse",
    name: "Sair",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-out",
    component: <SignOut />,
  },
];

export default routes;
