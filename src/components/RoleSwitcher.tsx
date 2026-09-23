import React from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function RoleSwitcher() {
  const { role, setRole } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === "worker") {
      navigate("/worker");
    } else if (selectedRole === "admin") {
      navigate("/admin");
    } else if (selectedRole === "user") {
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <label htmlFor="role-select" className="mr-2 text-sm font-medium"></label>
      <select
        id="role-select"
        value={role}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="worker">Worker</option>
      </select>
    </div>
  );
}
