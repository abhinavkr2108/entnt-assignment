import { Card } from "@mui/material";

export default function DemoCredentials() {
  return (
    <Card className="px-8 py-4 w-full">
      <h1 className="text-xl">Demo Credentials</h1>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p>Admin</p>
          <button>use</button>
        </div>
        <div className="flex justify-between items-center">
          <p>Admin</p>
          <button>use</button>
        </div>
        <div className="flex justify-between items-center">
          <p>Admin</p>
          <button>use</button>
        </div>
      </div>
    </Card>
  );
}
