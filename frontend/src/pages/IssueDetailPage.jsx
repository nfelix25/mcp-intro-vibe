import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { issuesApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { TagBadge } from '../components/TagBadge';
import { UserAvatar } from '../components/UserAvatar';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [id]);

  const loadIssue = async () => {
    try {
      const response = await issuesApi.get(id);
      setIssue(response.data);
    } catch (error) {
      toast.error('Failed to load issue');
      navigate('/issues');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    setDeleting(true);
    try {
      await issuesApi.delete(id);
      toast.success('Issue deleted successfully');
      navigate('/issues');
    } catch (error) {
      toast.error('Failed to delete issue');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/issues">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{issue.title}</h1>
                <StatusBadge status={issue.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>#{issue.id}</span>
                <span>
                  Created by {issue.created_by_user.name} on{' '}
                  {new Date(issue.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/issues/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {issue.description ? (
                  <p className="whitespace-pre-wrap">{issue.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">No description provided</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <p className="mt-1 capitalize">{issue.priority}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assignee</label>
                  {issue.assigned_user ? (
                    <div className="flex items-center gap-2 mt-1">
                      <UserAvatar user={issue.assigned_user} />
                      <span>{issue.assigned_user.name}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-muted-foreground italic">Unassigned</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  {issue.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {issue.tags.map(tag => (
                        <TagBadge key={tag.id} tag={tag} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-muted-foreground italic">No tags</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="mt-1">{new Date(issue.updated_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
