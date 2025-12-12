import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Issue Tracker</h1>
          <p className="text-xl text-muted-foreground">
            A simple and effective way to manage your project issues
          </p>
        </div>

        {user ? (
          <div className="text-center">
            <p className="text-lg mb-6">Welcome back, {user.name}!</p>
            <Link to="/issues">
              <Button size="lg">View Issues</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Already have an account?</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/signin">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create, update, and track all your project issues in one place
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organize with Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use tags to categorize and filter issues by type, priority, or topic
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assign & Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Assign issues to team members and track progress together
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
