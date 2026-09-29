"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageCircle,
  UsersRound,
  Globe,
  Flag,
  Bell,
  Bot,
  BarChart3,
  Settings,
  Shield,
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle,
  Activity,
  Menu,
  X,
} from "lucide-react";

type AdminSection =
  | "dashboard"
  | "users"
  | "posts"
  | "messages"
  | "groups"
  | "communities"
  | "reports"
  | "notifications"
  | "ai"
  | "statistics"
  | "settings"
  | "admins";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "groups", label: "Groups", icon: UsersRound },
  { id: "communities", label: "Communities", icon: Globe },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "Boi AchiverAI", icon: Bot },
  { id: "statistics", label: "Statistics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "admins", label: "Administrators", icon: Shield },
];

const demoUsers = [
  {
    id: "SF-1001",
    name: "Boi Achiver",
    username: "@boiachiver",
    status: "Active",
    role: "Super Admin",
  },
  {
    id: "SF-1002",
    name: "Andy Gill",
    username: "@andygill",
    status: "Active",
    role: "User",
  },
  {
    id: "SF-1003",
    name: "Social FreeText User",
    username: "@user001",
    status: "Active",
    role: "User",
  },
];

export default function AdminPage() {
  const [section, setSection] =
    useState<AdminSection>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentMenu = menuItems.find(
    (item) => item.id === section
  );

  return (
    <main className="admin-shell">
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-logo">SF</div>

          <div>
            <strong>Social freeText</strong>
            <span>Admin Center</span>
          </div>

          <button
            className="admin-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">BA</div>

          <div>
            <strong>BOI Achiver</strong>
            <span>Super Administrator</span>
          </div>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={
                  section === item.id ? "active" : ""
                }
                onClick={() => {
                  setSection(item.id as AdminSection);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <span>Admin ID</span>
          <strong>SF-ADMIN-001</strong>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <button
            className="admin-mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={23} />
          </button>

          <div>
            <h1>{currentMenu?.label}</h1>
            <p>Social freeText Administration</p>
          </div>

          <div className="admin-header-right">
            <button className="admin-search">
              <Search size={19} />
            </button>

            <div className="admin-header-user">
              <div className="admin-avatar small">BA</div>
              <div>
                <strong>BOI Achiver</strong>
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {section === "dashboard" && (
            <>
              <div className="admin-welcome">
                <div>
                  <span>WELCOME BACK</span>
                  <h2>BOI Achiver 👑</h2>
                  <p>
                    Manage and monitor Social freeText from one
                    place.
                  </p>
                </div>

                <Shield size={65} />
              </div>

              <div className="admin-stat-grid">
                <StatCard
                  icon={<Users />}
                  title="Total Users"
                  value="0"
                  change="Users registered"
                />

                <StatCard
                  icon={<Activity />}
                  title="Online Now"
                  value="0"
                  change="Currently online"
                />

                <StatCard
                  icon={<FileText />}
                  title="Posts"
                  value="0"
                  change="Published posts"
                />

                <StatCard
                  icon={<Flag />}
                  title="Reports"
                  value="0"
                  change="Awaiting review"
                />
              </div>

              <div className="admin-panels">
                <div className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Platform Activity</h3>
                      <p>Recent Social freeText activity</p>
                    </div>

                    <BarChart3 size={22} />
                  </div>

                  <div className="activity-empty">
                    <Activity size={38} />
                    <strong>No activity yet</strong>
                    <span>
                      Real platform statistics will appear
                      here after Firebase is connected.
                    </span>
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>System Status</h3>
                      <p>Social freeText services</p>
                    </div>

                    <CheckCircle size={22} />
                  </div>

                  <StatusRow
                    name="Website"
                    status="Online"
                  />

                  <StatusRow
                    name="Authentication"
                    status="Pending"
                  />

                  <StatusRow
                    name="Database"
                    status="Pending"
                  />

                  <StatusRow
                    name="Messaging"
                    status="Pending"
                  />
                </div>
              </div>
            </>
          )}

          {section === "users" && (
            <div className="admin-panel">
              <div className="panel-heading">
                <div>
                  <h3>User Management</h3>
                  <p>Manage Social freeText accounts</p>
                </div>

                <button className="admin-action">
                  <Users size={17} />
                  Add User
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>ID</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {demoUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar">
                              {user.name[0]}
                            </div>

                            <div>
                              <strong>{user.name}</strong>
                              <span>
                                {user.username}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>{user.id}</td>

                        <td>{user.role}</td>

                        <td>
                          <span className="status-active">
                            {user.status}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">
                            <button title="View user">
                              <UserCheck size={16} />
                            </button>

                            <button title="Suspend user">
                              <UserX size={16} />
                            </button>

                            <button title="Delete user">
                              <Trash2 size={16} />
                            </button>

                            <button title="More">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section !== "dashboard" &&
            section !== "users" && (
              <div className="admin-panel admin-coming">
                {currentMenu && (
                  <currentMenu.icon size={55} />
                )}

                <h2>{currentMenu?.label}</h2>

                <p>
                  This management section is being connected
                  to the Social freeText backend.
                </p>

                <span>
                  The interface is ready. Firebase data
                  integration comes next.
                </span>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="admin-stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{change}</small>
      </div>
    </div>
  );
}

function StatusRow({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  const online = status === "Online";

  return (
    <div className="system-status">
      <span>{name}</span>

      <strong className={online ? "online" : "pending"}>
        <i></i>
        {status}
      </strong>
    </div>
  );
}